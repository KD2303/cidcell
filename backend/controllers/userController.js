const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const isPaginated = req.query.page !== undefined;

        let query = User.find({}).sort({ createdAt: -1 });

        if (isPaginated) {
            query = query.skip(skip).limit(limit);
        }

        const users = await query;

        if (isPaginated) {
            const total = await User.countDocuments({});
            return res.json({
                users,
                page,
                pages: Math.ceil(total / limit),
                total
            });
        }

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;
            user.enrollmentNo = req.body.enrollmentNo || user.enrollmentNo;
            user.branch = req.body.branch || user.branch;
            user.batch = req.body.batch || user.batch;
            user.userType = req.body.userType || user.userType;
            
            // Handle skills (expecting array or comma-separated string)
            if (req.body.skills) {
                user.skills = Array.isArray(req.body.skills) 
                    ? req.body.skills 
                    : req.body.skills.split(',').map(s => s.trim());
            }

            // Handle social links
            if (req.body.socialLinks) {
                user.socialLinks = {
                    linkedin: req.body.socialLinks.linkedin || user.socialLinks.linkedin,
                    github: req.body.socialLinks.github || user.socialLinks.github,
                    leetcode: req.body.socialLinks.leetcode || user.socialLinks.leetcode,
                    other: req.body.socialLinks.other || user.socialLinks.other,
                };
            }

            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await User.deleteOne({ _id: user._id });
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
};
