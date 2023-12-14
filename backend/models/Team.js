const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    teamname: {
        type: String,
        required: true
    },
    projectname: {
        type: String,
        required: true
    },
    teamdescription: {
        type: String,
        required: true
    },
    qualityA: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    developerList: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }],
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
