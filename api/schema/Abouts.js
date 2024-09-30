const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
    siteToken: {
        type: String,
        required: true,
    },
    blockType: {
        type: String,
        required: true,
        enum:['image', 'video', 'text', 'spacer']
    },
    image:{
        type:String,
    },
    video:{
        type:String,
    },
    text:{
        header: { type: String },
        body: { type: String },
    },
    spacerSize:{
        type: String,
    },
    isLink:{
        type: Boolean
    }
});

module.exports = mongoose.model('About', aboutSchema);
