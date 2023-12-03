const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // Import your multer middleware
const profileController = require('../controllers/profileController');

// Add a new route for updating a profile
router.route('/')
    .post(upload.single('profilePic'), profileController.createProfile)
    .get(profileController.viewProfile)
    .put(upload.single('profilePic'), profileController.updateProfile) // New route for updating a profile
    .delete(profileController.deleteProfile);

module.exports = router;