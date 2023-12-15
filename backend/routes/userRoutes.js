const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

const verifyJWT = require('../middleware/verifyJWT');

// Apply verifyJWT only to routes that require authentication
router.use(['/patch', '/delete'], verifyJWT);

router.route('/')
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = router;
