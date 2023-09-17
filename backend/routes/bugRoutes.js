const express = require('express')
const router = express.Router()
const bugsController = require('../controllers/bugsController')

router.route('/')
    .get(bugsController.getAllBugs)
    .post(bugsController.createNewBug)
    .patch(bugsController.updateBug)
    .delete(bugsController.deleteBug)

module.exports = router