const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
    href: {
        type: String,
        required: true,
        match: [/^https?:\/\/[^\s$.?#].[^\s]*$/, 'Please enter a valid URL'], // Regular expression to match URI
    },
    platform: {
        type: String,
        required: true,
        enum: ['Youtube', 'LinkedIn', 'X', 'Instagram', 'TikTok', 'Spotify', 'Github', 'other'],
        default: 'LinkedIn',
    },
    siteToken: {
        type: String,
        required: true,
    },
    siteHandle: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Link', linkSchema);
