const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
        default:'',
    },
    startDate: {
        type: Date,
        required: true,
    },
    stopDate: {
        type: Date,
        default: null,
    },
    stillEmployed: {
        type: Boolean,
        default: true
    },
    duration: {
        type: String,
        default: null,
    },
    location: {
        type: String,
    },
    description: {
        type: String,
        maxlength: 375,
    },
    skills: [String],
    siteToken: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Experience', experienceSchema);
