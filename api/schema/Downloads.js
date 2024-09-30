const mongoose = require('mongoose');

const dsSchema = new mongoose.Schema({
    siteToken: {
        type: String,
        required: true,
        unique: true,
    },
    link: {
        type: String,
        required:true,
    },
    type: {
        type: String,
        required:true,
        enum:['resume','movie'],
        default:'resume'
    }
});

dsSchema.index({siteToken:1, link:1, type:1}, {unique:true});

module.exports = mongoose.model('Download', dsSchema);