const Team = require('../models/Team')
const User = require('../models/User')

const getallTeam = async(req,res)=>{
    const teams = await Team.find().populate('members', 'username')
    //makuha tanan teams
    res.json(teams)
}

const createTeam = async(req,res)=>{
    const {teamname, projectname, teamdescription, members} = req.body

    //check if naa ba gyuy gi input si user
    if(!teamname || !projectname || !teamdescription || !members){
        return res.status(400).json({message: `All fields are required`})
    }
    //check if naa na bay kapareho nga team
    const sameProject = await Team.findOne({projectname}).lean().exec()
    const sameName = await Team.findOne({teamname}).lean().exec()

    if(sameName){
        return res.status(409).json({message: `Team name already exist`})
    }
    if(sameProject){
        return res.status(409).json({message: `Project already exist`})
    }

    //diri na mag create
    const team = await Team.create({teamname,projectname,teamdescription,members})
    
    if(team){
        return res.status(201).json({message: `New project ${projectname} created`})
    }else{
        return res.status(400).json({message: `Not created`})
    }
}

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
    //kung naa kay magdelete ta sa selected nga team via teamname
    await team.deleteOne()
    res.status(204).send()
}

const updateTeam = async (req,res) => {
    const {id, teamname, projectname, teamdescription, members} = req.body
    //check if naa ba gyuy gi input si user
    if(!id || !teamname || !projectname || !teamdescription || !members){
        return res.status(400).json({message: `All fields are required`})
    }
    const team = await Team.findById(id)

    //check if ni exist ba si team via id
    if(!team){
        res.status(400).json({message: `ID does not exist`})
    }
    
    team.projectname = projectname
    team.teamname = teamname
    team.teamdescription = teamdescription
    team.members = members

    const updatedTeam = team.save()
    res.json({message: `Team Updated`})
}
module.exports = {
    createTeam,
    getallTeam,
    deleteTeam,
    updateTeam
}