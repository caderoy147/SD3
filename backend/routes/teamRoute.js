const express = require('express')
const router = express.Router()
const teamcontroller = require('../controllers/teamcontroller')

router.route('/')
 .post(teamcontroller.createTeam)
 .get(teamcontroller.getallTeam)
 .delete(teamcontroller.deleteTeam)
 .patch(teamcontroller.updateTeam)
 
module.exports = router