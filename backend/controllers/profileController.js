const Profile = require('../models/Profile')
const User = require('../models/User')

const viewProfile = async (req, res) => {
    try {
        const profiles = await Profile.find().lean();

        // Update image paths to include full URL with forward slashes
        const profilesWithFullUrl = profiles.map(profile => {
            return {
                ...profile,
                profilePic: `${req.protocol}://${req.get('host')}/${profile.profilePic.replace(/\\/g, '/')}`,
            };
        });

        res.json(profilesWithFullUrl);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


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

const updateProfile = async (req, res) => {
    const { id, fullName, age, mobile, location, zipCode, language, company } = req.body;

    // Check if the 'id' field is provided
    if (!id) {
        return res.status(400).json({ message: 'Profile ID is required for updating' });
    }

    // Find the profile by ID
    const profile = await Profile.findById(id);

    // Check if the profile exists
    if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
    }

    // Update the profile fields if they are provided
    if (fullName) profile.fullName = fullName;
    if (age) profile.age = age;
    if (mobile) profile.mobile = mobile;
    if (location) profile.location = location;
    if (zipCode) profile.zipCode = zipCode;
    if (language) profile.language = language;
    if (company) profile.company = company;

    // Check if a file is uploaded and set the profilePic field
    if (req.file) {
        profile.profilePic = req.file.path;
    }

    // Save the updated profile
    const updatedProfile = await profile.save();

    if (updatedProfile) {
        return res.status(200).json({ message: 'Profile updated successfully' });
    } else {
        return res.status(400).json({ message: 'Failed to update profile' });
    }
};

module.exports = {
    viewProfile,
    createProfile,
    deleteProfile,
    updateProfile
}