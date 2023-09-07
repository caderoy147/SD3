require('dotenv').config()

const express = require('express')


//express app
const app = express()

//middleware
app.use((req,nes,next)=>{
  console.log(req.path, req.method)
  next()
})

//routes
app.get('/', (req,res) => {
  res.json({mssg: 'Welcome to the app'})
})

//listen for request
app.listen(process.env.PORT, () => {
  console.log('listening on port 4000')
})

