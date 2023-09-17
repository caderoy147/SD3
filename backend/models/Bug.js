const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const bugSchema = new mongoose.Schema(
  {
    user:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    bugNumber:{
      type: String,
      required: true
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
    }

  },

  {
  timestamps: true
  }
)

bugSchema.plugin(AutoIncrement,{
  inc_field:'bug',
  id: 'bugNums',
  start_seq: 500
})

module.exports = mongoose.model('Bug', bugSchema)