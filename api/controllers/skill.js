require('dotenv').config();
const { ensureAuthenticated } = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const Skill = require("../schema/Skills");

// get all skills for site
router.get("/site-skills", async (req, res) => {
    try{
        const skills = await Skill.find({siteToken:process.env.SITE_TOKEN}).sort({strength: 1}).select('-siteToken');
        if (!skills) return res.status(400).send("No Skills Found");
        return res.status(200).json({skills});
    }catch(error){
        console.log("Error fetching skills", error);
        return res.status(500).send("Error fetching skills");
    }
});

// create new skill
router.post("/create", ensureAuthenticated, async (req, res)=>{
    const {skill} = req.body;
    try{
        const newSkill = new Skill({
            skill: skill.skill,
            strength: skill.strength,
            siteToken: process.env.SITE_TOKEN
        });
        await newSkill.save();
        return res.status(201).send("Skill Created")
    }catch(error){
        console.log("Error creating skill", error);
        return res.status(500).json({error:error, message:"failed to create skill"});
    }
});

router.put("/update/:_id", ensureAuthenticated, async (req, res) => {
    const {_id} = req.params;
    const {skill, strength} = req.body;
    try{
        const updatedSkill = await Skill.findById({_id});
        if (!updatedSkill) return res.status(400).send("Skill Not Found");
        updatedSkill.skill = skill;
        updatedSkill.strength = strength;
        updatedSkill.save();
        res.status(200).send("Success");
    }catch(error){
        console.log(error);
        res.status(500).json({error:error, message:"Failed to update skill"});
    }
})

// delete skill with id
router.post("/delete/:_id", ensureAuthenticated, async (req, res)=>{
    const {_id} = req.params;
    try{
        const deletedSkill = await Skill.findByIdAndDelete(_id);
        if (!deletedSkill) return res.status(400).send('Skill not found');
        return res.status(200).send("Successfully deleted skill");
    }catch(error){
        console.log("Error deleting skill", error);
        return res.status(200).send("Error deleting skill");
    }
})

module.exports = router;