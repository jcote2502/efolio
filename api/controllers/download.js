require('dotenv').config();
const { ensureAuthenticated } = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const Download = require('../schema/Downloads');
const { fileLimiter } = require('../middleware/limiters');
const { deletePDF, addPDF } = require('../utils/Bucket');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get("/site-resume", async (req, res) => {
    try {
        // hides sensitive information from site visitors
        const resume = await Download.findOne({ siteToken: process.env.SITE_TOKEN, type: 'resume' });
        if (!resume) {
            return res.status(400).send("Resume Info Not Found");
        }
        return res.status(200).json(resume)
    } catch (error) {
        console.error("Fetch Resume Error: ", error);
        return res.status(500).send("Error Fetching Resume Info")
    }
});

router.post('/add-resume', fileLimiter, ensureAuthenticated, upload.single('resume'), async (req, res) => {
    const newFile = req.file;
    console.log(newFile)
    try {
        if (!newFile){
            return res.status(500).send("No file provided");
        }

        const newResume = new Download({
            link: 'temp',
            type: 'resume',
            siteToken: process.env.SITE_TOKEN
        });

        newResume.save();

        const newDestination = `resumes/${newResume._id}/${newFile.originalname}`;
        const newDocumentURL = await addPDF(newFile.buffer, newDestination);
        console.log("Uploaded PDF URL:", newDocumentURL);

        newResume.link = newDocumentURL;

        await newResume.save();
        return res.status(200).send('Success');
    }catch(error){
        console.log(error);
        return res.status(500).send("error adding resume");
    }
})

router.put('/update-resume/:_id', async (req, res) => {

})

router.get("/site-download:/_id", async (req, res) => {
    const { _id } = req.params;
    try {
        const download = Download.findById(_id);
        if (!download) return res.status(400).send("Download not found");
        return res.status(200).json(download);
    } catch (error) {
        console.log(`Error fetching download (${_id})`, error);
        return res.status(500).send("Error fetching experience");
    }
});

// add a file to the bucket + store url in db
router.put("/add-download/:_id", fileLimiter, ensureAuthenticated, upload.single('application/pdf'),
    upload.single('application/pdf'), async (req, res) => {
        const { _id } = req.params;
        const newFile = req.file;

        if (!newFile) {
            return res.status(500).send('No file provided');
        }
        // log line -> delete later
        console.log(newFile)

        try {
            // add to bucket
            const destination = `PDFS/${_id}/${newFile.originalname}`;
            const newFileUrl = await addPDF(newFile.buffer, destination);
            const download = new Download({
                siteToken: process.env.SITE_TOKEN,
                link: newFileUrl
            })
            download.save();
            return res.status(200).json(newImageUrl)
        } catch (error) {
            console.error("Error handling file:", error);
            return res.status(500).send("Failed to upload image");
        }
    })

router.post('/delete/_id', ensureAuthenticated, async (req, res) => {
    const { _id } = req.params;
    try {
        const deletedDocument = await Download.findByIdAndDelete(_id);
        if (!deletedDocument) return res.status(404).send('Download not found');
        const oldFilePath = decodeURIComponent(deletedDocument.link.split('/o/')[1].split('?')[0]);
        await deletePDF(oldFilePath);
        return res.status(200).send('Successfully removed');
    } catch (error) {
        console.log("Error deleting document", error);
        return res.status(500).send("Error deleting document");
    }
})


module.exports = router;


