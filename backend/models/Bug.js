const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid');

const bugSchema = new mongoose.Schema(
  {
    user:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    bugNumber: {
      type: String,
      default: uuidv4(),
      unique: true,
      required: true,
    },
    severity:{
      type: String,
      required: true
    },
    description:{
      type: String,
      required: true
    },
    expectedResult:{
      type: String,
      required: true
    },
    bugName:{
      type: String,
      required: true
    },
    environment:{
      type: String,
      required: true
    },
    reproduction:{
      type: String,
      required: true
    },
    actualResult:{
      type: String,
      required: true
    },
    status:{
      type: String,
      default:"OPEN"
    },
    remarks:{
      type: String,
      default: "In Progress"
    },
    bugProof:{
      type: String
    }
  },
  {
  timestamps: true
  }
)
module.exports = mongoose.model('Bug', bugSchema)