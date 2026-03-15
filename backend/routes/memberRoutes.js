const express = require('express');
const router = express.Router();
const {
    getMembers,
    addMember,
    updateMember,
    removeMember
} = require('../controllers/memberController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getMembers)
    .post(protect, admin, addMember);

router.route('/:id')
    .put(protect, admin, updateMember)
    .delete(protect, admin, removeMember);

module.exports = router;
