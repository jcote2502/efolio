require('dotenv').config();
const { ensureAuthenticated } = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const Link = require('../schema/Links');

// get all links associated with this site
router.get("/site-links", async (req,res) => {
    try{
        const links = await Link.find({siteToken:process.env.SITE_TOKEN}).select('-siteToken');
        if(!links) return res.status(400).send("No links found");
        return res.status(200).json(links);
    }catch(error){
        console.log("Error fetching links", error);
        return res.status(500).send("Error fetching links");
    }
});

router.post("/create", ensureAuthenticated, async (req, res)=>{
    const {link} = req.body;
    try{
        const newLink = new Link({
            href : link.href,
            platform : link.platform,
            siteHandle: link.siteHandle,
            siteToken: process.env.SITE_TOKEN
        });
        await newLink.save();
        return res.status(200).send("Link Created");
    }catch(error){
        console.log("Error creating link", error);
        return res.status(500).json({error:error, message:"failed to create skill"});
    }
})

// update single link by id
router.put("/update-link/:_id", ensureAuthenticated, async (req, res)=> {
    const {_id} = req.params;
    const {href, platform, siteHandle} = req.body;
    console.log(href, platform, siteHandle, _id);
    try{
        const updatedlink = await Link.findById({_id});
        if(!updatedlink) return res.status(400).send("Unable to find link");

        updatedlink.href = href;
        updatedlink.platform = platform;
        updatedlink.siteHandle = siteHandle;

        await updatedlink.save();

        return res.status(200).send("Success");
    }catch(error){
        console.log("Error updating link:", error);
        return res.status(500).send("Failed to update link");
    }
});

router.post("/delete/:_id", ensureAuthenticated, async (req, res)=>{
    const {_id} = req.params;
    try{
        const deletedLink = await Link.findByIdAndDelete(_id);
        if (!deletedLink) return res.status(400).send('Link not found');
        return res.status(200).send("Successfully deleted link");
    }catch(error){
        console.log("Error deleting link", error);
        return res.status(200).send("Error deleting link");
    }
})



module.exports = router;