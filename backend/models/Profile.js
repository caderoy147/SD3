const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    }, 
    mobile:{
        type: Number,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    zipCode:{
        type: Number,
        required: true
    },
    language: [{
        type: String,
        required: true
    }],
    company: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        required: true
    }
})
module.exports = mongoose.model('Profile', profileSchema)