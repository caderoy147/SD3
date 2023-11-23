const express = require('express')
const router = express.Router()
const profileController = require('../controllers/profileController')
const upload = require("../middleware/upload")

router.route('/')
 .post(profileController.createProfile)
 .get(profileController.viewProfile)
 .delete(profileController.deleteProfile)
 .patch(profileController.updateProfile)
module.exports = router