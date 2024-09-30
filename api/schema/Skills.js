const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    siteToken: {
        type: String,
        required: true,
    },
    skill:{
        type:String,
        required: true,
    },
    strength:{
        type: String,
        required:true,
        enum: ['1','2','3'],
        default: '1'
    }
})

// ensures that no site can have duplicate skills
skillSchema.index({siteToken:1, skill:1}, {unique:true});


module.exports= mongoose.model('Skill', skillSchema);
