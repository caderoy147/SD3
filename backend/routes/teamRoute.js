const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamcontroller');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

// Teams API
router.route('/')
  .post(teamController.createTeam)
  .get(teamController.getallTeam)
  .delete(teamController.deleteTeam);

// Update a specific team
router.patch('/:teamId', teamController.updateTeam);

// Add bugs to a specific team
router.post('/:teamId/bugs', teamController.addBugsToTeam);

module.exports = router;
