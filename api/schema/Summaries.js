const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
    summary: {
        type: String,
        required: true,
    },
    siteToken: {
        type: String,
        required: true,
    },
});

summarySchema.index({siteToken:1, summary:1}, {unique: true});

module.exports = mongoose.model('Summary', summarySchema);
