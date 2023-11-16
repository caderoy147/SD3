const express = require('express')
const router = express.Router()
const bugsController = require('../controllers/bugsController')
const upload = require("../middleware/upload")

router.route('/')
    .get(bugsController.getAllBugs)
    .post(upload.single('bugProof'),bugsController.createNewBug)
    .patch(upload.single('bugProof'),bugsController.updateBug)
    .delete(bugsController.deleteBug)

module.exports = router