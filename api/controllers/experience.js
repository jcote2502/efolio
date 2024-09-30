require('dotenv').config();
const { ensureAuthenticated } = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const Experience = require("../schema/Experiences");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { addImage, deleteFile } = require('../utils/Bucket');
const { fileLimiter } = require('../middleware/limiters');


// get all experiences for site
router.get("/site-experiences", async (req, res) => {
    try {
        const experiencesDate = await Experience.find({ siteToken: process.env.SITE_TOKEN })
            .sort({
                stopDate: -1,
            }).select('-siteToken');
        const experiencesNoDate = await Experience.find({ siteToken: process.env.SITE_TOKEN, stopDate: null });
        const experiences = experiencesNoDate.concat(experiencesDate);
        if (!experiences) return res.status(400).send("No Experiences Found");
        return res.status(200).json({ experiences });
    } catch (error) {
        console.log("Error fetching experiences", error);
        return res.status(500).send("Error fetching experiences");
    }
});

// update specific experience by id
router.put("/update-experience/:_id", fileLimiter, upload.single('image'), ensureAuthenticated, async (req, res) => {
    const { _id } = req.params;
    const { experience, previousHref } = req.body;
    const newFile = req.file;

    try {
        const parsedExperience = JSON.parse(experience);
        const updatedExperience = await Experience.findById(_id);
        if (!updatedExperience) return res.status(400).send("Experience not found");

        if (newFile) {
            const newDestination = `experience/images/${updatedExperience._id}/${newFile.originalname}`;
            const newImageUrl = await addImage(newFile.buffer, newDestination);
            if (typeof newImageUrl === 'string') {
                parsedExperience.image = newImageUrl;
            }
        }

        Object.assign(updatedExperience, parsedExperience);
        updatedExperience.siteToken = process.env.SITE_TOKEN;

        await updatedExperience.save();

        res.status(200).send("Success");

        try {
            if (previousHref) {
                const oldFilePath = decodeURIComponent(previousHref.split('/o/')[1].split('?')[0]);
                await deleteFile(oldFilePath);
            }
        } catch (error) {
            return
        }
    } catch (error) {
        console.log("Error updating Experience", error);
        return res.status(500).json({ error: error, message: "Error updating Experience" });
    }
});

// create new experience
router.post("/create", fileLimiter, upload.single('image'), ensureAuthenticated, async (req, res) => {
    const { experience } = req.body;
    const newFile = req.file;

    try {
        const parsedExperience = JSON.parse(experience);
        const newExperience = new Experience(parsedExperience);
        newExperience.image = '';
        newExperience.siteToken = process.env.SITE_TOKEN;
        const savedExperience = await newExperience.save();

        if (newFile) {
            const newDestination = `images/${savedExperience._id}/${newFile.originalname}`;
            const newImageUrl = await addImage(newFile.buffer, newDestination);
            // Ensure newImageUrl is a string before assigning
            if (typeof newImageUrl === 'string') {
                savedExperience.image = newImageUrl;
                await savedExperience.save();
            } else {
                throw new Error("Image URL returned is not a string");
            }
        }

        return res.status(201).send("Experience Created");
    } catch (error) {
        console.log("Error creating experience", error);
        return res.status(500).json({ error: error.message, message: "Failed to create experience" });
    }
});

// delete experience with id
router.post("/delete/:_id", ensureAuthenticated, async (req, res) => {
    const { _id } = req.params;
    try {
        const experience = await Experience.findById(_id);
        if (!deletedExperience) return res.status(404).send('Experience not found');

        // need to delete image
        if (experience.image) {
            const oldFilePath = decodeURIComponent(experience.image.split('/o/')[1].split('?')[0]);
            await deleteFile(oldFilePath);
        }

        await experience.remove();
        return res.status(200).send("Successfully deleted experience");
    } catch (error) {
        console.log("Error deleting experience", error);
        return res.status(200).send("Error deleting experience");
    }
})

module.exports = router;
