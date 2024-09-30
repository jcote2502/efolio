const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    siteToken: {
        type: String,
        required: true,
    },
    featured:{
        type: Boolean,
        default: false
    },
    associatedCompany:{
        type:String,
        required: false,
    },
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        default: null,
    },
    duration: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        default: null,
    },
    currentlyWorking : {
        type: Boolean,
        default: false,
    },
    location: {
        type: String,
        default: null,
    },
    image: {
        type: String,
        required:false,
        default:'',
    },
    links: {
        type: [String],
    },
    skills: {
        type: [String],
    },
    summary: {
        type: String,
        default: null,
        maxlength: 1000,
    },
    shortSummary: {
        type: String,
        required: true,
        maxlength: 75,
    },
    sections: [{
        header: { type: String},
        body: { type: String },
        image: { type: String},
    }],
});

module.exports = mongoose.model('Project', projectSchema);
