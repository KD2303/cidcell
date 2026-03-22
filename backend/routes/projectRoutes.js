const express = require('express');
const router = express.Router();
const {
    getProjects,
    createProject,
    updateProject,
    approveProject,
    deleteProject
} = require('../controllers/projectController');
const { protect, admin, adminOrTeacher } = require('../middleware/authMiddleware');

router.route('/')
    .get(getProjects)
    .post(protect, createProject); // Removed mandatory admin for creation      

router.route('/:id')
    .put(protect, adminOrTeacher, updateProject)
    .delete(protect, adminOrTeacher, deleteProject);

router.patch('/:id/approve', protect, adminOrTeacher, approveProject);

module.exports = router;
