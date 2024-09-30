const express = require('express');
const router = express.Router();

const userController = require('./user');
const summaryController = require('./summary');
const aboutController = require('./about');
const linkController = require('./link');
const projectController = require('./project');
const experienceController = require('./experience');
const skillController = require('./skill');
const educationController = require('./education');
const downloadController = require('./download');

router.use('/users', userController);
router.use('/summaries', summaryController)
router.use('/abouts', aboutController);
router.use('/links', linkController);
router.use('/projects', projectController);
router.use('/experiences', experienceController);
router.use('/skills', skillController);
router.use('/educations', educationController);
router.use('/downloads', downloadController);

module.exports = router;