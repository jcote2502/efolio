require('dotenv').config();
const { ensureAuthenticated } = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const Project = require('../schema/Projects');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { addImage, deleteFile } = require('../utils/Bucket');
const { fileLimiter } = require('../middleware/limiters');

// do NOT modify

// get all project for site
router.get("/site-projects", async (req, res) => {
    try {
        const projects = await Project.find({ siteToken: process.env.SITE_TOKEN }).select('-siteToken')
        if (!projects) return res.status(400).send("No Projects Found");
        return res.status(200).json({ projects });
    } catch (error) {
        console.log("Error fetching projects", error);
        return res.status(500).send("Error fetching projects");
    }
});

// get specific project by id
router.get("/site-project/:_id", async (req, res) => {
    const { _id } = req.params;
    try {
        const project = await Project.findById(_id).select('-siteToken');
        if (!project) return res.status(400).send("Project not found");
        return res.status(200).json(project);
    } catch (error) {
        console.log(`Error fetching project (${_id}):`, error);
        return res.status(500).send("Error fetching project");
    }
})

// update specific project by id
router.put("/update-project-info/:_id", fileLimiter, upload.single('image'), ensureAuthenticated, async (req, res) => {
    const { _id } = req.params;
    const { project, previousHref } = req.body;
    const newFile = req.file;

    try {

        const parsedProject = JSON.parse(project);
        const updatedProject = await Project.findById(_id);
        if (!updatedProject) return res.status(400).send("Project not found");


        updatedProject.title = parsedProject.title;
        updatedProject.featured = parsedProject.featured;
        updatedProject.associatedCompany = parsedProject.associatedCompany;
        updatedProject.subtitle = parsedProject.subtitle;
        updatedProject.duration = parsedProject.duration;
        updatedProject.startDate = parsedProject.startDate;
        updatedProject.endDate = parsedProject.endDate;
        updatedProject.currentlyWorking = parsedProject.currentlyWorking;
        updatedProject.location = parsedProject.location;
        updatedProject.links = parsedProject.links;
        updatedProject.skills = parsedProject.skills;
        updatedProject.summary = parsedProject.summary;
        updatedProject.shortSummary = parsedProject.shortSummary;
        updatedProject.siteToken = process.env.SITE_TOKEN;

        if (previousHref) {
            const oldFilePath = decodeURIComponent(previousHref.split('/o/')[1].split('?')[0]);
            await deleteFile(oldFilePath);
        }

        if (newFile) {
            const newDestination = `images/${_id}/${newFile.originalname}`;
            const newImageUrl = await addImage(newFile.buffer, newDestination);
            if (!newImageUrl) {
                return res.status(500).send("Failed to add image");
            }
            updatedProject.image = newImageUrl;
        }


        await updatedProject.save();

        return res.status(200).send('Success');
    } catch (error) {
        console.log("Error updating project", error);
        return res.status(500).json({ error: error, message: "Error updating project" });
    }
});

// create new project
router.post("/create", ensureAuthenticated, async (req, res) => {
    const { project } = req.body;
    try {
        const newProject = new Project(project);
        newProject.siteToken = process.env.SITE_TOKEN;
        await newProject.save();
        const _id = newProject._id
        return res.status(200).json(_id);
    } catch (error) {
        console.log("Error creating project", error);
        return res.status(500).json({ error: error, message: "failed to create project" });
    }
});

// delete project with id
router.post("/delete/:_id", ensureAuthenticated, async (req, res) => {
    const { _id } = req.params;
    try {
        const deletedProject = await Project.findByIdAndDelete(_id);
        if (!deletedProject) return res.status(404).send('Project not found');
        return res.status(200).send("Successfully deleted project");
    } catch (error) {
        console.log("Error deleting project", error);
        return res.status(200).send("Error deleting project");
    }
})

// update project section in project with id
router.put("/update-section/:_id", ensureAuthenticated, fileLimiter, upload.single('image'), async (req, res) => {
    const { _id } = req.params;
    const { section } = req.body;
    const newFile = req.file;
    try {
        const project = await Project.findById(_id);
        if (!project) {
            return res.status(400).send('Project not found');
        }

        const parsedSection = JSON.parse(section);

        const oldSection = project.sections.id(parsedSection._id);

        if (!oldSection) {
            return res.status(400).send('Section not found');
        }

        if (oldSection.image) {
            const oldFilePath = decodeURIComponent(oldSection.image.split('/o/')[1].split('?')[0]);
            await deleteFile(oldFilePath);
        }

        if (newFile) {
            const newDestination = `images/${_id}/${newFile.originalname}`;
            const newImageUrl = await addImage(newFile.buffer, newDestination);
            if (!newImageUrl) {
                return res.status(500).send("Failed to add image");
            }
            oldSection.image = newImageUrl;
        }

        oldSection.header = parsedSection.header;
        oldSection.body = parsedSection.body;

        await project.save();

        res.status(200).send("Successfully updated Section");

    } catch (error) {
        console.error('Error updating section:', error);
        res.status(500).json({ message: "Failed to update section", error });
    }
})

// add project section to project with id
router.put("/add-section/:_id", ensureAuthenticated, fileLimiter, upload.single('image'), async (req, res) => {
    const { _id } = req.params;
    const { section } = req.body;
    const newFile = req.file;

    try {
        const project = await Project.findById(_id);
        if (!project) {
            return res.status(400).send('Project not found');
        }

        const parsedSection = JSON.parse(section);

        if (newFile) {
            const newDestination = `images/${_id}/${newFile.originalname}`;
            const newImageUrl = await addImage(newFile.buffer, newDestination);
            if (!newImageUrl) {
                return res.status(500).send("Failed to add image");
            }
            parsedSection.image = newImageUrl;
        }

        project.sections.push(parsedSection);

        await project.save();

        res.status(200).send("Successfully added Section");

    } catch (error) {
        console.error('Error adding section:', error);
        res.status(500).json({ message: "Failed to add section", error });
    }
})


// needs work
// delete project section with id
router.put("/delete-section/:_id", ensureAuthenticated, async (req, res) => {
    const { _id } = req.params;
    const { section } = req.body;
    try {
        const project = await Project.findById(_id);
        if (!project) {
            return res.status(400).send('Project not found');
        }

        const oldSection = project.sections.id(section._id);

        if (!oldSection) {
            return res.status(400).send('Section not found');
        }

        if (oldSection.image) {
            const image = oldSection.image;
            const oldFilePath = decodeURIComponent(image.split('/o/')[1].split('?')[0]);
            await deleteFile(oldFilePath);
        }

        project.sections.pull({_id: section._id});

        await project.save();

        res.status(200).send("Successfully deleted Section");

    } catch (error) {
        console.error('Error deleting section:', error);
        res.status(500).json({ message: "Failed to delete section", error });
    }
})

module.exports = router;