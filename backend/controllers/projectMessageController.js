const ProjectMessage = require('../models/ProjectMessage');
const Project = require('../models/Project');

// @desc    Get all messages for a specific project (group only)
// @route   GET /api/project-messages/:projectId
// @access  Private (Contributors and Creator only)
const getProjectMessages = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is creator or an accepted contributor
        const isCreator = project.createdBy.toString() === req.user._id.toString();
        const isContributor = project.contributors.some(
            c => c.userId.toString() === req.user._id.toString()
        );

        if (!isCreator && !isContributor) {
            return res.status(403).json({ message: 'Not authorized to view this chat' });
        }

        const messages = await ProjectMessage.find({ projectId })
            .populate('senderId', 'username profilePicture')
            .sort({ createdAt: 1 }); // Oldest first for chat history

        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getProjectMessages };
