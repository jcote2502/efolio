require('dotenv').config();
const { ensureAuthenticated } = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const About = require('../schema/Abouts');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { addImage, addMP4, deleteFile } = require('../utils/Bucket');
const { fileLimiter } = require('../middleware/limiters');

router.get("/site-about", async (req, res) => {
    try {
        const about = await About.find({ siteToken: process.env.SITE_TOKEN }).select('-siteToken');
        if (!about) return res.status(400).send("No about page found");
        return res.status(200).json(about);
    } catch (error) {
        console.log("Error fetching about", error);
        return res.status(200).send("Error fetching about page");
    }
});

router.post("/create", ensureAuthenticated, fileLimiter, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
    const { newSection } = req.body;
    const newImage = req.files['image'];
    const newVideo = req.files['video'];

    console.log(newImage);
    console.log(newVideo);


    try {
        const parsedSection = JSON.parse(newSection);

        const section = new About(parsedSection);
        if (parsedSection.image) {
            section.image = '';
        }
        if (parsedSection.video) {
            if (!parsedSection.isLink) {
                section.video = '';
            }
        }
        section.siteToken = process.env.SITE_TOKEN;
        const savedSection = await section.save();

        // If image is uploaded
        if (newImage) {
            const image = newImage[0];
            console.log(image);
            imageDestination = `section/images/${savedSection._id}/${image.originalname}`;

            const imageUrl = await addImage(image.buffer, imageDestination);

            if (typeof imageUrl === 'string') {
                savedSection.image = imageUrl;
                await savedSection.save();
            }
        }

        // If video is uploaded
        if (newVideo) {
            const video = newVideo[0];
            videoDestination = `section/mp4s/${savedSection._id}/${video.originalname}`;

            const videoUrl = await addMP4(video.buffer, videoDestination);

            if (typeof videoUrl === 'string') {
                savedSection.video = videoUrl;
                await savedSection.save();
            }
        }

        res.status(200).send("Successfully added Section");
    } catch (error) {
        console.error('Error adding section:', error);
        res.status(500).json({ message: "Failed to add section", error });
    }
});

router.put("/update-section/:_id", fileLimiter, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), ensureAuthenticated, async (req, res) => {
    const { _id } = req.params;
    const { updatedSection, previousHref } = req.body;

    const newImage = req.files['image'];
    const newVideo = req.files['video'];

    console.log(newImage);


    try {
        const oldSection = await About.findById(_id);
        if (!oldSection) {
            return res.status(400).send('Section not found');
        }

        const parsedSection = JSON.parse(updatedSection);

        if (newImage) {
            const image = newImage[0];
            console.log(image);
            const imageDestination = `section/images/${oldSection._id}/${image.originalname}`;

            const imageUrl = await addImage(image.buffer, imageDestination);

            if (typeof imageUrl === 'string') {
                parsedSection.image = imageUrl;
            }
        }

        if (newVideo) {
            const video = newVideo[0];
            videoDestination = `section/mp4s/${oldSection._id}/${video.originalname}`;

            const videoUrl = await addMP4(video.buffer, videoDestination);

            if (typeof videoUrl === 'string') {
                parsedSection.video = videoUrl;
            }
        }

        // Update the old section with the new parsed section
        Object.assign(oldSection, parsedSection);

        // Save the updated section
        await oldSection.save();


        res.status(200).send("Successfully updated section");

        if (previousHref) {
            try {
                if (section.image) {
                    const oldFilePath = decodeURIComponent(previousHref.split('/o/')[1].split('?')[0]);
                    await deleteFile(oldFilePath);
                }
                if (section.video) {
                    const oldFilePath = decodeURIComponent(previousHref.split('/o/')[1].split('?')[0]);
                    await deleteFile(oldFilePath);
                }
                return;
            } catch (error) {
                return console.error('error deleting file')
            }
        }

        return;

    } catch (error) {
        console.error('Error updating section:', error);
        res.status(500).json({ message: "Failed to update section", error });
    }
});


router.post("/delete-section/:_id", ensureAuthenticated, async (req, res) => {
    const { _id } = req.params;

    try {
        // Step 1: Find the section by ID
        const section = await About.findById(_id);
        if (!section) {
            return res.status(400).send('Section not found');
        }


        // Step 5: Delete the section from the database
        await About.findByIdAndDelete(_id);

        // Step 6: Send success response
        res.status(200).send("Section and associated media successfully deleted");
        try {
            if (section.image) {
                const oldFilePath = decodeURIComponent(section.image.split('/o/')[1].split('?')[0]);
                await deleteFile(oldFilePath);
            }
            if (section.video) {
                const oldFilePath = decodeURIComponent(section.video.split('/o/')[1].split('?')[0]);
                await deleteFile(oldFilePath);
            }
        } catch (error) {
            return console.error('error deleting file')
        }
    } catch (error) {
        console.error('Error deleting section:', error);
        res.status(500).json({ message: "Failed to delete section", error });
    }
});



module.exports = router;