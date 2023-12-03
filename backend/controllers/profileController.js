const Profile = require('../models/Profile')
const User = require('../models/User')

const viewProfile = async(req, res) =>{
    const profile = await Profile.find().populate('fullName').lean()
    res.json(profile)
}

const createProfile = async (req, res) => {
    const { fullName, age, mobile, location, zipCode, language, company} = req.body;

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
    const { id } = req.body

    //if walay gi input
    if(!id){
        return res.status(400).json({message: `ID is required.`})
    }

    //if naa ba gyud ang team
    const profile = Profile.findOne({id})

    if(!profile){
        return res.status(400).json({message: `Project does not exist.`})
    }
    //kung naa kay magdelete ta sa selected nga project via projectname
    await profile.deleteOne()
    res.status(204).json({ message: 'Profile Deleted.'})
}

const updateProfile = async (req, res) => {
    const { id, fullName, age, mobile, location, zipCode, language, company } = req.body;

    // Check if required fields are provided
    if (!id || !fullName || !age || !mobile || !location || !zipCode || !language || !company) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    let profileData = {
        fullName,
        age,
        mobile,
        location,
        language,
        company,
        zipCode,
    };

    // Check if a file is uploaded and set the profilePic field
    if (req.file) {
        profileData.profilePic = req.file.path;
    }

    const updatedProfile = await Profile.findByIdAndUpdate(id, profileData, { new: true });

    if (updatedProfile) {
        return res.status(200).json({ message: 'Profile updated', profile: updatedProfile });
    } else {
        return res.status(404).json({ message: 'Profile not found' });
    }
};

module.exports = {
    viewProfile,
    createProfile,
    deleteProfile,
    updateProfile
}