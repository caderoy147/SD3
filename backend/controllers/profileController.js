const Profile = require('../models/Profile')
const User = require('../models/User')

const viewProfile = async(req, res) =>{
    const profile = await Profile.find().populate('fullName').lean()
    res.json(profile)
}

const createProfile = async (req, res) => {
    const { fullName, age, mobile, location, zipCode, language, company } = req.body;

    // Check if required fields are provided
    if (!fullName || !age || !mobile || !location || !zipCode || !language || !company) {
        res.status(400).json({ message: 'All fields are required' });
    }

    let profileData = {
        fullName,
        age,
        mobile,
        location,
        language,
        company,
        zipCode
    };

    // Check if a file is uploaded and set the profilePic field
    if (req.file) {
        profileData.profilePic = req.file.path;
    }

    const profile = await Profile.create(profileData);

    if (profile) {
        return res.status(201).json({ message: 'Profile updated' });
    } else {
        return res.status(400).json({ message: 'Not created' });
    }
};

const deleteProfile = async (req, res) => {
    const { fullName } = req.body

    //if walay gi input
    if(!fullName){
        return res.status(400).json({message: `ID is required.`})
    }

    //if naa ba gyud ang team
    const profile = Profile.findOne({fullName})

    if(!profile){
        return res.status(400).json({message: `Project does not exist.`})
    }
    //kung naa kay magdelete ta sa selected nga project via projectname
    await profile.deleteOne()
    res.status(204).send()
}

module.exports = {
    viewProfile,
    createProfile,
    deleteProfile
}