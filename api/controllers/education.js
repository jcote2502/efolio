require('dotenv').config();
const { ensureAuthenticated } = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const Education = require("../schema/Educations");
const multer = require('multer');
const { addImage, deleteFile } = require('../utils/Bucket'); 
const upload = multer({ storage: multer.memoryStorage() });
const { fileLimiter } = require('../middleware/limiters');

// Do not MODIFY 

// Done
// get all education for site
router.get("/site-educations", async (req, res) => {
    try {
        const educations = await Education.find({ siteToken: process.env.SITE_TOKEN })
        if (!educations) return res.status(400).send("No Educations Found");
        return res.status(200).json(educations);
    } catch (error) {
        console.log("Error fetching educations", error);
        return res.status(500).send("Error fetching educations");
    }
});

// Done
// update specific education by id
router.put("/update-education/:_id", fileLimiter, ensureAuthenticated, upload.single('image'), async (req, res) => {
    const { _id } = req.params;
    const { education, previousHref } = req.body;
    const newFile = req.file;

    try {
        const parsedEducation = JSON.parse(education);
        const updatedEducation = await Education.findById(_id);
        if (!updatedEducation) return res.status(400).send("Education not found");

        updatedEducation.school = parsedEducation.school;
        updatedEducation.location = parsedEducation.location;
        updatedEducation.gpa = parsedEducation.gpa;
        updatedEducation.specificCollege = parsedEducation.specificCollege;
        updatedEducation.startDate = parsedEducation.startDate;
        updatedEducation.endDate = parsedEducation.endDate;
        updatedEducation.degreeLevel = parsedEducation.degreeLevel;
        updatedEducation.degree = parsedEducation.degree;
        updatedEducation.minor = parsedEducation.minor;
        updatedEducation.achievements = parsedEducation.achievements;
        updatedEducation.associations = parsedEducation.associations;
        updatedEducation.siteToken = process.env.SITE_TOKEN;
        updatedEducation._id = _id;

        if (previousHref){
            const oldFilePath = decodeURIComponent(previousHref.split('/o/')[1].split('?')[0]);
            await deleteFile(oldFilePath); 
        }

        if (newFile) {
            const newDestination = `images/${_id}/${newFile.originalname}`;
            const newImageUrl = await addImage(newFile.buffer, newDestination);
            if (!newImageUrl){
                return res.status(500).send("Failed to add image");
            }
            updatedEducation.image = newImageUrl;
        }

        await updatedEducation.save();

        return res.status(200).send("Success");
    } catch (error) {
        console.log("Error updating education", error);
        return res.status(500).json({ error: error, message: "Error updating education" });
    }
});

// Done
// create new education
router.post("/create", fileLimiter, ensureAuthenticated, upload.single('image'), async (req, res) => {
    const { education } = req.body;
    const newFile = req.file;

    try {
        const parsedEducation = JSON.parse(education);
        const newEducation = new Education(parsedEducation);
        newEducation.image = '';
        newEducation.siteToken = process.env.SITE_TOKEN;
        const savedEducation = await newEducation.save();

        if (newFile) {
            const newDestination = `images/${savedEducation._id}/${newFile.originalname}`;
            const newImageUrl = await addImage(newFile.buffer, newDestination);
            
            // Log the URL returned by addImage for debugging
            console.log("Uploaded image URL:", newImageUrl); // Ensure this is a string

            // Ensure newImageUrl is a string before assigning
            if (typeof newImageUrl === 'string') {
                savedEducation.image = newImageUrl;
                await savedEducation.save();
            } else {
                throw new Error("Image URL returned is not a string");
            }
        }

        return res.status(201).send("Education Created");
    } catch (error) {
        console.log("Error creating education", error);
        return res.status(500).json({ error: error.message, message: "Failed to create education" });
    }
});

// Done
// delete education with id
router.post("/delete/:_id", ensureAuthenticated, async (req, res) => {
    const { _id } = req.params;
    try {
        const deletedEducation = await Education.findByIdAndDelete(_id);
        if (!deletedEducation) return res.status(404).send('Education not found');
        return res.status(200).send("Successfully deleted education");
    } catch (error) {
        console.log("Error deleting education", error);
        return res.status(200).send("Error deleting education");
    }
})

module.exports = router;