const mongoose = require('mongoose');

const projectMessageSchema = new mongoose.Schema({
    projectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Project', 
        required: true 
    },
    senderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    text: { 
        type: String, 
        required: true 
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Index for efficient querying of project messages
projectMessageSchema.index({ projectId: 1, createdAt: 1 });

module.exports = mongoose.model('ProjectMessage', projectMessageSchema);
