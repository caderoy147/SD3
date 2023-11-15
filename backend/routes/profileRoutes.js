const express = require('express')
const router = express.Router()
const profileController = require('../controllers/profileController')
const upload = require("../middleware/upload")

router.route('/')
 .post(upload.single('profilePic'), profileController.createProfile)
 .get(profileController.viewProfile)
 .delete(profileController.deleteProfile)
 
module.exports = router