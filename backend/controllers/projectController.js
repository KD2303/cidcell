const Project = require('../models/Project');

// @desc    Get all projects (Approved for public, all for admin)
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12; // Default 12 per page
        const skip = (page - 1) * limit;

        const isPaginated = req.query.page !== undefined;

        // If query param 'all' is true return everything, otherwise only approved ones
        const filter = (req.query.all === 'true') ? {} : { isApproved: true };  

        let query = Project.find(filter).populate('createdBy', 'username email');
        
        if (isPaginated) {
            query = query.skip(skip).limit(limit);
        }

        const projects = await query;
        
        if (isPaginated) {
            const total = await Project.countDocuments(filter);
            return res.json({
                projects,
                page,
                pages: Math.ceil(total / limit),
                total
            });
        }

        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
    try {
        const { name, theme, description, techStack, github, liveLink, mentor, members, status, year, imageUrl } = req.body;

        const project = new Project({
            name,
            theme,
            description,
            techStack: Array.isArray(techStack) ? techStack : techStack.split(',').map(s => s.trim()),
            github,
            liveLink,
            mentor,
            members: Array.isArray(members) ? members : (members ? members.split(',').map(s => s.trim()) : []),
            status,
            year,
            imageUrl,
            createdBy: req.user._id,
            // Automatically approve if it's an admin creating it
            isApproved: req.user.userType === 'Admin'
        });

        const createdProject = await project.save();
        res.status(201).json(createdProject);
    } catch (error) {
        res.status(400).json({ message: error.message || 'Invalid project data' });
    }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (project) {
            project.name = req.body.name || project.name;
            project.theme = req.body.theme || project.theme;
            project.description = req.body.description || project.description;
            
            if (req.body.techStack !== undefined) {
                project.techStack = Array.isArray(req.body.techStack) 
                    ? req.body.techStack 
                    : req.body.techStack.split(',').map(s => s.trim());
            }
            
            project.github = req.body.github || project.github;
            project.liveLink = req.body.liveLink || project.liveLink;
            project.mentor = req.body.mentor || project.mentor;
            
            if (req.body.members !== undefined) {
                project.members = Array.isArray(req.body.members) 
                    ? req.body.members 
                    : (req.body.members ? req.body.members.split(',').map(s => s.trim()) : []);
            }
            
            project.status = req.body.status || project.status;
            project.year = req.body.year || project.year;
            project.imageUrl = req.body.imageUrl || project.imageUrl;
            
            // Allow admin to toggle approval
            if (req.user.userType === 'Admin' && req.body.isApproved !== undefined) {
                project.isApproved = req.body.isApproved;
            }

            const updatedProject = await project.save();
            res.json(updatedProject);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message || 'Invalid project data' });
    }
};

// @desc    Approve/Reject a project
// @route   PATCH /api/projects/:id/approve
// @access  Private/Admin
const approveProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (project) {
            project.isApproved = req.body.isApproved;
            const updatedProject = await project.save();
            res.json(updatedProject);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (project) {
            await Project.deleteOne({ _id: req.params.id });
            res.json({ message: 'Project removed' });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getProjects,
    createProject,
    updateProject,
    approveProject,
    deleteProject
};
