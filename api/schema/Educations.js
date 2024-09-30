const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
    siteToken:{
        type: String,
        required: true,
    },
    school:{
        type:String,
        required:true,
    },
    location:{
        type:String,
        required:false,
    },
    specificCollege:{
        type:String,
        required:false
    },
    gpa:{
        type:String,
        required:false
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true,
    },
    degreeLevel:{
        type: String,
        required: true,
        enum: ["Diploma", "Associate", "Bachelor", "Master", "Doctorate"],
        default: 'Bachelor'
    },
    degree: {
        type: String,
        required: true,
    },
    minor: {
        type: String,
        required: false,
    },
    achievements: [String],
    associations: [String],
    image:{
        type:String,
        required: false,
    }
});

module.exports = mongoose.model('Education', educationSchema);