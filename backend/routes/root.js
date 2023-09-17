const express = require('express')
const router = express.Router()
const path = require('path')

/*this is regx syntax ambot unsa na basta ^ = beginning of string $ = end of string

'^/$|/index(.html)?' = kani kay if si user nahan '/' ra or root. or kung "/" + index or /+index+HTML
akong pag sabot balig acesses

*/
router.get('^/$|/index(.html)?',(req,res)=>{
  res.sendFile(path.join(__dirname,'../','views','index.html'))
}) 

module.exports = router