const Bug = require('../models/Bug')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')

// @desc Get all bugs 
// @route GET /bugs
// @access Private
const getAllBugs = asyncHandler(async (req, res) => {
    // Get all bugs from MongoDB
    const bugs = await Bug.find().lean()

    // If no bugs 
    if (!bugs?.length) {
        return res.status(400).json({ message: 'No bug reports found' })
    }

    // Add username to each bug before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const bugsWithUser = await Promise.all(bugs.map(async (bug) => {
        const user = await User.findById(bug.user).lean().exec()
        return { ...bug, username: user.username }
    }))

    res.json(bugsWithUser)
})

// @desc Create new note
// @route POST /bugs
// @access Private
const createNewBug = asyncHandler(async (req, res) => {
    const { qa, dev, manager, team, severity, description, expectedResult, bugName, environment, reproduction, actualResult } = req.body;
  
    // Confirm data
    if (!qa || !dev || !team || !severity || !description || !expectedResult || !bugName || !environment || !reproduction || !actualResult) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    let bugData = {
      qa,
      dev,
      manager,
      team,
      severity,
      description,
      expectedResult,
      bugName,
      environment,
      reproduction,
      actualResult,
    };
  
    if (req.file) {
      bugData.bugProof = req.file.path;
    }
  
    // Create and store the new bug
    const bug = await Bug.create(bugData);
  
    if (bug) {
      // Created
      return res.status(201).json({ message: 'New bug report created' });
    } else {
      return res.status(400).json({ message: 'Invalid bug report data received' });
    }
  });
  
// @desc Update a note
// @route PATCH /notes
// @access Private
const updateBug = asyncHandler(async (req, res) => {
    const { id, user, severity, description, expectedResult, bugName, environment, reproduction, actualResult } = req.body;

    // Confirm data
    if (!id || !user || !severity || !description || !expectedResult || !bugName || !environment || !reproduction || !actualResult) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Confirm bug exists to update
    const bug = await Bug.findById(id).exec();

    if (!bug) {
        return res.status(400).json({ message: 'Bug report not found' });
    }

    // Check for duplicate bug number (if you want to prevent duplicates)
    // You should get the existing bugNumber from the database
    const existingBug = await Bug.findById(id).lean().exec();
    const duplicate = await Bug.findOne({ bugNumber: existingBug.bugNumber }).lean().exec();

    if (duplicate && duplicate._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate bug number' });
    }

    // Update bug fields
    bug.user = user;
    bug.severity = severity;
    bug.description = description;
    bug.expectedResult = expectedResult;
    bug.bugName = bugName;
    bug.environment = environment;
    bug.reproduction = reproduction;
    bug.actualResult = actualResult;

    if(req.file){
        bug.bugProof = req.file.path;
    }
    const updatedBug = await bug.save();

    res.json(`'${updatedBug.bugNumber}' updated`);
});

// @desc Delete a bug
// @route DELETE /bugs
// @access Private
const deleteBug = asyncHandler(async (req, res) => {
    const { id } = req.body;

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Bug ID required' });
    }

    // Confirm bug exists to delete
    const bug = await Bug.findById(id).exec();

    if (!bug) {
        return res.status(400).json({ message: 'Bug report not found' });
    }

    await bug.deleteOne();

    res.status(204).send();
});

module.exports = {
    getAllBugs,
    createNewBug,
    updateBug,
    deleteBug
}