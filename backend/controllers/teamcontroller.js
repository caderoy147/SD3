const Team = require('../models/Team')
const User = require('../models/User')

const getallTeam = async(req,res)=>{
    const teams = await Team.find().populate('developerList', 'username').populate('qualityA', 'username')
    //makuha tanan teams
    res.json(teams)
}

const createTeam = async (req, res) => {
    const { teamname, projectname, teamdescription, developerList, qualityA } = req.body;

    // Check if required fields are provided
    if (!teamname || !projectname || !teamdescription || !developerList || !qualityA) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Filter developerList to include only users with the "Developer" role
    const developerIds = developerList.filter(async (developerId) => {
        const user = await User.findById(developerId).exec();
        return user && user.roles.includes('Developer');
    });

    // Check if all elements in developerList are valid users with the "Developer" role
    if (developerIds.length !== developerList.length) {
        return res.status(400).json({ message: 'Invalid users in developerList' });
    }

    // Check if the team name already exists
    const sameName = await Team.findOne({ teamname }).lean().exec();

    if (sameName) {
        return res.status(409).json({ message: 'Team name already exists' });
    }

    // Check if the project name already exists
    const sameProject = await Team.findOne({ projectname }).lean().exec();

    if (sameProject) {
        return res.status(409).json({ message: 'Project name already exists' });
    }

    // Filter qualityA to include only users with the "Quality Assurance" role
    const qualityAId = qualityA;

    // Assuming User.findById(qualityAId) fetches the user document
    const user = await User.findById(qualityAId).exec();
    if (!user || !user.roles.includes('Quality Assurance')) {
        return res.status(400).json({ message: 'Invalid user in qualityA' });
    }

    // Create the team with the provided information
    const team = await Team.create({
        teamname,
        projectname,
        teamdescription,
        developerList: developerIds,
        qualityA: qualityAId,
    });

    if (team) {
        return res.status(201).json({ message: `New project ${projectname} created` });
    } else {
        return res.status(400).json({ message: 'Not created' });
    }
}

const updateTeam = async (req, res) => {
    const { id, teamname, projectname, teamdescription, developerList, qualityA } = req.body;

    // Check if required fields are provided
    if (!id || !teamname || !projectname || !teamdescription || !developerList || !qualityA) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Find the team by ID
        const team = await Team.findById(id);

        // Check if the team exists
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Update team properties
        team.projectname = projectname;
        team.teamname = teamname;
        team.teamdescription = teamdescription;

        // Filter developerList to include only users with the "Developer" role
        const developerIds = developerList.filter(async (developerId) => {
            const user = await User.findById(developerId).exec();
            return user && user.roles.includes('Developer');
        });

        // Check if all elements in developerList are valid users with the "Developer" role
        if (developerIds.length !== developerList.length) {
            return res.status(400).json({ message: 'Invalid users in developerList' });
        }

        // Update the developerList
        team.developerList = developerIds;

        // Update qualityA to include only users with the "Quality Assurance" role
        const qualityAUser = await User.findById(qualityA).exec();
        if (!qualityAUser || !qualityAUser.roles.includes('Quality Assurance')) {
            return res.status(400).json({ message: 'Invalid user in qualityA' });
        }

        // Update qualityA
        team.qualityA = qualityA;

        // Save the updated team
        const updatedTeam = await team.save();

        if (updatedTeam) {
            return res.status(200).json({ message: 'Team updated successfully' });
        } else {
            return res.status(500).json({ message: 'Internal server error' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteTeam = async (req, res) => {
    const { projectname } = req.body

    //if walay gi input
    if(!projectname){
        return res.status(400).json({message: `ID is required.`})
    }

    //if naa ba gyud ang team
    const team = Team.findOne({projectname})

    if(!team){
        return res.status(400).json({message: `Project does not exist.`})
    }
    //kung naa kay magdelete ta sa selected nga project via projectname
    await team.deleteOne()
    res.status(204).send()
}

module.exports = {
    createTeam,
    getallTeam,
    deleteTeam,
    updateTeam
}