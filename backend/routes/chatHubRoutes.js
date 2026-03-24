const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Message = require('../models/Message');
const DoubtSession = require('../models/DoubtSession');
const Project = require('../models/Project');
const ProjectMessage = require('../models/ProjectMessage');
const { onlineUsers } = require('../socket/onlineStore');

// ────────────────────────────────────────────
// Route 1: GET /api/chat/conversations
// Returns sidebar data for the logged-in user
// ────────────────────────────────────────────
router.get('/conversations', protect, async (req, res) => {
    try {
        const userId = req.user._id;
        const userType = req.user.userType;
        const isAdmin = ['Admin', 'admin'].includes(userType);

        // --- DM section: role-based user list ---
        let dmUsers = [];
        if (userType === 'student') {
            // Students see ALL mentors
            dmUsers = await User.find({
                userType: 'mentor',
                _id: { $ne: userId }
            }).select('_id username profilePicture expertise domainOfExpertise');
        } else if (userType === 'mentor') {
            // Mentors see their students (from doubt sessions) + all other mentors
            const studentIds = await DoubtSession.find({
                mentorId: userId
            }).distinct('studentId');
            dmUsers = await User.find({
                $or: [
                    { _id: { $in: studentIds } },
                    { userType: 'mentor', _id: { $ne: userId } }
                ]
            }).select('_id username profilePicture userType expertise domainOfExpertise');
        } else if (['faculty', 'HOD'].includes(userType) || isAdmin) {
            // Faculty / HOD / Admin see all users
            dmUsers = await User.find({
                _id: { $ne: userId }
            }).select('_id username profilePicture userType');
        }

        // --- Doubt sessions section ---
        let doubtSessions = [];
        if (userType === 'student') {
            doubtSessions = await DoubtSession.find({
                studentId: userId
            }).populate('mentorId', 'username profilePicture')
              .sort({ updatedAt: -1 });
        } else if (userType === 'mentor') {
            doubtSessions = await DoubtSession.find({
                mentorId: userId
            }).populate('studentId', 'username profilePicture')
              .sort({ updatedAt: -1 });
        }
        // Faculty/HOD/Admin: doubtSessions stays empty — section hidden

        // --- Project chats section ---
        const projects = await Project.find({
            status: 'active',
            $or: [
                { createdBy: userId },
                { 'contributors.userId': userId, 'contributors.status': 'active' },
                { 'mentors.userId': userId }
            ]
        }).select('_id title createdBy contributors mentors')
          .populate('createdBy', 'username profilePicture');

        res.json({ dmUsers, doubtSessions, projects });
    } catch (err) {
        console.error('GET /chat/conversations error:', err);
        res.status(500).json({ message: err.message });
    }
});

// ────────────────────────────────────────────
// Route 2: GET /api/chat/unread-counts
// Returns unread DM + project message counts
// ────────────────────────────────────────────
router.get('/unread-counts', protect, async (req, res) => {
    try {
        const userId = req.user._id;

        // Unread DMs — messages sent TO this user with status !== 'read'
        const unreadDMs = await Message.aggregate([
            { $match: {
                receiverId: new mongoose.Types.ObjectId(userId),
                status: { $ne: 'read' },
                isDeleted: { $ne: true }
            }},
            { $group: {
                _id: '$senderId',
                count: { $sum: 1 }
            }}
        ]);

        // Get user's qualifying projects
        const userProjects = await Project.find({
            status: 'active',
            $or: [
                { createdBy: userId },
                { 'contributors.userId': userId, 'contributors.status': 'active' },
                { 'mentors.userId': userId }
            ]
        }).select('_id');
        const projectIds = userProjects.map(p => p._id);

        // Unread project messages
        const unreadProjects = await ProjectMessage.aggregate([
            { $match: {
                projectId: { $in: projectIds },
                senderId: { $ne: new mongoose.Types.ObjectId(userId) },
                isRead: false
            }},
            { $group: {
                _id: '$projectId',
                count: { $sum: 1 }
            }}
        ]);

        // Format response as { senderId: count } and { projectId: count }
        const dms = {};
        unreadDMs.forEach(d => { dms[d._id.toString()] = d.count; });

        const projects = {};
        unreadProjects.forEach(p => { projects[p._id.toString()] = p.count; });

        res.json({ dms, projects });
    } catch (err) {
        console.error('GET /chat/unread-counts error:', err);
        res.status(500).json({ message: err.message });
    }
});

// ────────────────────────────────────────────
// Route 3: GET /api/chat/online-status
// Returns online status for a list of user IDs
// ────────────────────────────────────────────
router.get('/online-status', protect, async (req, res) => {
    try {
        const ids = req.query.ids ? req.query.ids.split(',') : [];
        const result = {};
        ids.forEach(id => {
            result[id] = onlineUsers.has(id) && onlineUsers.get(id).size > 0;
        });
        res.json(result);
    } catch (err) {
        console.error('GET /chat/online-status error:', err);
        res.status(500).json({ message: err.message });
    }
});

// ────────────────────────────────────────────
// Route 4: PATCH /api/chat/mark-read
// Marks messages as read for a conversation
// Body: { type: 'dm'|'project', id: String }
// ────────────────────────────────────────────
router.patch('/mark-read', protect, async (req, res) => {
    try {
        const userId = req.user._id;
        const { type, id } = req.body;

        if (!type || !id) {
            return res.status(400).json({ message: 'type and id are required' });
        }

        if (type === 'dm') {
            // Mark all unread DMs from this sender as read
            const result = await Message.updateMany(
                {
                    senderId: id,
                    receiverId: userId,
                    status: { $ne: 'read' }
                },
                { $set: { status: 'read' } }
            );
            return res.json({ updated: result.modifiedCount });
        }

        if (type === 'project') {
            // Mark all unread project messages as read
            const result = await ProjectMessage.updateMany(
                {
                    projectId: id,
                    senderId: { $ne: userId },
                    isRead: false
                },
                { $set: { isRead: true } }
            );
            return res.json({ updated: result.modifiedCount });
        }

        return res.status(400).json({ message: 'Invalid type. Must be "dm" or "project".' });
    } catch (err) {
        console.error('PATCH /chat/mark-read error:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
