const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')

/*this is regx syntax ambot unsa na basta ^ = beginning of string $ = end of string

'^/$|/index(.html)?' = kani kay if si user nahan '/' ra or root. or kung "/" + index or /+index+HTML
akong pag sabot balig acesses

*/
router.route('/')
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser)




module.exports = router