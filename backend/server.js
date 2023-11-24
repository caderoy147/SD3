require('dotenv').config()

const express = require('express')


//express app
const app = express()

//PATHS
const path = require('path')

//errorhandler
const errorHandler = require('./middleware/errorHandler')

//cookieparser
const cookieParser = require('cookie-parser')

//cors requ
const cors = require('cors')

//cors
const corsOptions = require('./config/corsOptions')

const connectDB = require('./config/dbConn')

const mongoose = require('mongoose')

const {logger, logEvents} = require('./middleware/logger')

//PORT
const PORT = process.env.PORT || 4000

console.log(process.env.NODE_ENV)

//connectDB
connectDB()

//middleware if app.use thats middleware
app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))

app.use('/users',require('./routes/userRoutes'))

app.use('/uploads', express.static('uploads'));
app.use('/bugs',require('./routes/bugRoutes'))
app.use('/teams', require('./routes/teamRoute'))
app.use('/profiles', require('./routes/profileRoutes'))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.all('*',(req,res)=>{
  res.status(404)
  if(req.accepts('html')){
    res.sendFile(path.join(__dirname,'views','404.html'))
  }else if(req.accepts('json')){
    res.json({message: '404 Not found'})
  }else{
    res.type('txt').send('404 Not Found')
  }
})

//error
app.use(errorHandler)

mongoose.connection.once('open',()=>{
  console.log('Connected to mongoDB')
  //listen for request
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  }) 
})

mongoose.connection.on('error',err=>{
  console.log(err)
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})


