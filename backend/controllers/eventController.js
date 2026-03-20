const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12; // Default 12 per page
        const skip = (page - 1) * limit;

        const isPaginated = req.query.page !== undefined; // Only paginate if page is explicitly provided

        let query = Event.find({}).select('-whatsappGroupLink').sort({ date: 1 });
        
        if (isPaginated) {
            query = query.skip(skip).limit(limit);
        }

        const events = await query;
        
        if (isPaginated) {
            const total = await Event.countDocuments({});
            return res.json({
                events,
                page,
                pages: Math.ceil(total / limit),
                total
            });
        }

        res.json(events); // Fallback for backwards compatibility
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('registrations');
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const eventData = event.toObject({ virtuals: true });

        // Security: Remove whatsapp link if not authorized
        let isAuthorized = false;
        
        // Use a manual check for token if we want to handle this gracefully
        // But the route is 'Public', so we check req.user if it exists (via optional auth middleware or manual check)
        // For now, let's assume we might have req.user if protect middleware was used or similar
        // If not, we check registrations
        const userId = req.user?._id;
        if (userId) {
            const isRegistered = await EventRegistration.findOne({ eventId: req.params.id, userId });
            if (isRegistered || req.user.userType === 'Admin') {
                isAuthorized = true;
            }
        }

        if (!isAuthorized) {
            delete eventData.whatsappGroupLink;
        }

        res.json(eventData);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
    try {
        const eventData = {
            ...req.body,
            createdBy: req.user._id
        };
        const event = new Event(eventData);
        const createdEvent = await event.save();
        res.status(201).json(createdEvent);
    } catch (error) {
        res.status(400).json({ message: error.message || 'Invalid event data' });
    }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (event) {
            Object.assign(event, req.body);
            const updatedEvent = await event.save();
            res.json(updatedEvent);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message || 'Invalid event data' });
    }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (event) {
            await Event.deleteOne({ _id: req.params.id });
            // Also delete related registrations
            await EventRegistration.deleteMany({ eventId: req.params.id });
            res.json({ message: 'Event removed' });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private
const registerForEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if already registered
        const alreadyRegistered = await EventRegistration.findOne({
            eventId: req.params.id,
            userId: req.user._id
        });

        if (alreadyRegistered) {
            return res.status(400).json({ message: 'Already registered for this event' });
        }

        // Check capacity
        if (event.registeredCount >= event.maxAttendees) {
            return res.status(400).json({ message: 'Event is full' });
        }

        const registration = new EventRegistration({
            eventId: req.params.id,
            userId: req.user._id,
            userName: req.user.username || req.user.name,
            userEmail: req.user.email
        });

        await registration.save();

        // Increment registered count
        event.registeredCount += 1;
        await event.save();

        res.status(201).json({ message: 'Registered successfully', whatsappLink: event.whatsappGroupLink });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Registration failed' });
    }
};

// @desc    Get all registrations for an event (Admin only)
// @route   GET /api/events/:id/registrations
const getEventRegistrations = async (req, res) => {
    try {
        const registrations = await EventRegistration.find({ eventId: req.params.id })
            .populate('userId', 'name email sapId branch year section');
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    getEventRegistrations
};
