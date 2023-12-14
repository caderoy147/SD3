const Team = require('../models/Team');
const User = require('../models/User');
const Bug = require('../models/Bug');

const getallTeam = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('developerList', 'username')
      .populate('qualityA', 'username')
      .populate('manager', 'username');
    res.json(teams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createTeam = async (req, res) => {
  const { teamname, projectname, teamdescription, developerList, qualityA, manager } = req.body;

  if (!teamname || !projectname || !teamdescription || !developerList || !qualityA || !manager) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const developerPromises = developerList.map(async (developerId) => {
      const user = await User.findById(developerId).exec();
      return user && user.roles.includes('Developer') ? developerId : null;
    });

    const developerIds = await Promise.all(developerPromises);
    const validDeveloperIds = developerIds.filter((id) => id !== null);

    if (validDeveloperIds.length !== developerList.length) {
      return res.status(400).json({ message: 'Invalid users in developerList' });
    }

    const sameName = await Team.findOne({ teamname }).lean().exec();
    if (sameName) {
      return res.status(409).json({ message: 'Team name already exists' });
    }

    const sameProject = await Team.findOne({ projectname }).lean().exec();
    if (sameProject) {
      return res.status(409).json({ message: 'Project name already exists' });
    }

    const qualityAUser = await User.findById(qualityA).exec();
    if (!qualityAUser || !qualityAUser.roles.includes('Quality Assurance')) {
      return res.status(400).json({ message: 'Invalid user in qualityA' });
    }

    const managerUser = await User.findById(manager).exec();
    if (!managerUser || !managerUser.roles.includes('Manager')) {
      return res.status(400).json({ message: 'Invalid user in manager' });
    }

    const team = await Team.create({
      teamname,
      projectname,
      teamdescription,
      developerList: validDeveloperIds,
      qualityA,
      manager,
    });

    if (team) {
      return res.status(201).json({ message: `New project ${projectname} created` });
    } else {
      return res.status(400).json({ message: 'Not created' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateTeam = async (req, res) => {
  const { id, teamname, projectname, teamdescription, developerList, qualityA, manager } = req.body;

  if (!id || !teamname || !projectname || !teamdescription || !developerList || !qualityA || !manager) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const team = await Team.findById(id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    team.projectname = projectname;
    team.teamname = teamname;
    team.teamdescription = teamdescription;

    const developerPromises = developerList.map(async (developerId) => {
      const user = await User.findById(developerId).exec();
      return user && user.roles.includes('Developer') ? developerId : null;
    });

    const developerIds = await Promise.all(developerPromises);
    const validDeveloperIds = developerIds.filter((id) => id !== null);

    if (validDeveloperIds.length !== developerList.length) {
      return res.status(400).json({ message: 'Invalid users in developerList' });
    }

    team.developerList = validDeveloperIds;

    const qualityAUser = await User.findById(qualityA).exec();
    if (!qualityAUser || !qualityAUser.roles.includes('Quality Assurance')) {
      return res.status(400).json({ message: 'Invalid user in qualityA' });
    }

    const managerUser = await User.findById(manager).exec();
    if (!managerUser || !managerUser.roles.includes('Manager')) {
      return res.status(400).json({ message: 'Invalid user in manager' });
    }

    team.qualityA = qualityA;
    team.manager = manager;

    const updatedTeam = await team.save();

    if (updatedTeam) {
      return res.status(200).json({ message: 'Team updated successfully' });
    } else {
      return res.status(500).json({ message: 'Internal server error' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ... rest of the code remains the same ...

const deleteTeam = async (req, res) => {
  const { projectname } = req.body;

  if (!projectname) {
    return res.status(400).json({ message: `Project name is required.` });
  }

  try {
    const team = await Team.findOne({ projectname });

    if (!team) {
      return res.status(400).json({ message: `Project does not exist.` });
    }

    await team.deleteOne();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addBugsToTeam = async (req, res) => {
  const { teamId, bugIds } = req.body;

  if (!teamId || !bugIds || !Array.isArray(bugIds)) {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Assuming Bug.create() is a valid function to create bugs
    const bugs = await Bug.create(bugIds.map(bugId => ({ team: teamId, ...bugId })));

    if (bugs) {
      return res.status(200).json({ message: 'Bugs added to team successfully' });
    } else {
      return res.status(500).json({ message: 'Internal server error' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createTeam,
  getallTeam,
  deleteTeam,
  updateTeam,
  addBugsToTeam,
};
