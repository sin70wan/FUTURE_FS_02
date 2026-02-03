const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    phone: {
        type: String,
        trim: true
    },
    company: {
        type: String,
        trim: true
    },
    source: {
        type: String,
        enum: ['Website', 'LinkedIn', 'Referral', 'Email Campaign', 'Social', 'Other'],
        default: 'Website'
    },
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Converted', 'Lost'],
        default: 'New'
    },
    notes: [{
        content: {
            type: String,
            required: true
        },
        createdBy: {
            type: String,
            default: 'System'
        },
        type: {
            type: String,
            enum: ['call', 'email', 'meeting', 'note', 'status', 'created'],
            default: 'note'
        }
    }],
    lastContact: {
        type: Date,
        default: Date.now
    },
    followUpDate: {
        type: Date
    },
    assignedTo: {
        type: String
    },
    location: {
        type: String
    }
}, {
    timestamps: true
});

// Update lastContact when status changes
leadSchema.pre('save', function(next) {
    if (this.isModified('status')) {
        this.lastContact = Date.now();
    }
    next();
});

module.exports = mongoose.model('Lead', leadSchema);