const express = require('express');
const router = express.Router();
const {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    getEventRegistrations
} = require('../controllers/eventController');
const { protect, admin, optionalProtect } = require('../middleware/authMiddleware');
const { validate, schemas } = require('../middleware/validate');

router.route('/')
    .get(validate(schemas.paginationSchema), getEvents)
    .post(protect, admin, validate(schemas.createEventSchema), createEvent);

router.route('/:id')
    .get(optionalProtect, getEventById)
    .put(protect, admin, updateEvent)
    .delete(protect, admin, deleteEvent);

router.route('/:id/registrations')
    .get(protect, admin, getEventRegistrations);

router.post('/:id/register', protect, registerForEvent);

module.exports = router;
