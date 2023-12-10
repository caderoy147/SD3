const express = require('express')
const router = express.Router()
const profileController = require('../controllers/profileController')
const upload = require("../middleware/upload")
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .post(upload.single('profilePic'), profileController.createProfile)
    .get(profileController.viewProfile)
    .put(upload.single('profilePic'), profileController.updateProfile) // New route for updating a profile
    .delete(profileController.deleteProfile);

module.exports = router;