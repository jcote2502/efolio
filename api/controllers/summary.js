require('dotenv').config();
const { ensureAuthenticated } = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const Summary = require('../schema/Summaries');


// Do NOT modify file.

// done
router.get('/user-summary', async (req, res) => {

    try {
        const summary = await Summary.findOne({ siteToken: process.env.SITE_TOKEN });
        return res.status(201).json({ summary });
    } catch (error) {
        console.log("Error fetching user associated summaries", error);
        return res.status(500).send("Error fetching summaries");
    }
});

//done
router.put('/update-summary/:_id', ensureAuthenticated, async (req, res) => {

    const { _id } = req.params;
    const { newSummary } = req.body;

    try {
        const summary = await Summary.findById(_id);
        if (!summary) return res.status(400).send("Summary not found");
        summary.summary = newSummary;
        summary.save();
        res.status(200).json({ summary: summary, message: "Successfully updated summary" });
    } catch (error) {
        console.log("Error updating summary:", error);
        return res.status(500).send("Error updating summary");
    }
})

// done
router.post('/create', ensureAuthenticated, async (req, res) => {

    const { newSummary } = req.body;

    try {
        const summary = new Summary({
            summary: newSummary,
            siteToken: process.env.SITE_TOKEN
        });
        await summary.save();
        return res.status(200).send("Summary Created");
    } catch (error) {
        console.log("Error Creating Summary:", error);
        return res.status(500).send("Failed to create summary");
    }
});

// done
router.post('/delete/:_id', ensureAuthenticated, async (req, res) => {

    const { _id } = req.params;

    try {
        const deletedSummary = await Summary.findByIdAndDelete(_id);
        if (!deletedSummary) return res.status(400).send("Summary not found");
        return res.status(200).send("Successfully deleted summary");
    } catch (error) {
        console.log("Error deleting message", error);
        return res.status(500).send("Failed to delete summary");
    }
})

module.exports = router;