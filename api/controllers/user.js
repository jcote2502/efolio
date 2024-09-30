require('dotenv').config();
const bcrypt = require('bcrypt');
const { ensureAuthenticated, sendTokenResponse, hashPassword, passwordCompare } = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const User = require('../schema/Users');
const { loginLimiter , fileLimiter } = require('../middleware/limiters');
const multer = require('multer');
const { addImage, deleteFile } = require('../utils/Bucket'); // Importing the addImage function
const upload = multer({ storage: multer.memoryStorage() });

// works
// retrieves data for 
router.get("/site-info", async (req, res) => {
    try {
        // hides sensitive information from site visitors
        const user = await User.findOne({ siteToken: process.env.SITE_TOKEN }).select('-password -authToken -siteToken');
        if (!user) {
            return res.status(404).send("User Info Not Found");
        }
        return res.status(200).json(user)
    } catch (error) {
        console.error("Fetch User Error: ", error);
        return res.status(500).send("Error Fetching User Info")
    }
});

// works
// fetch user with authToken
router.get("/get-with-token/:authToken", ensureAuthenticated, async (req, res) => {
    const { authToken } = req.params;
    try {
        const user = await User.findOne({ authToken }).select('-password -authToken -siteToken');
        if (!user) {
            return res.status(404).send("User not Found");
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error("Fetch User Error: ", error);
        return res.status(500).send("Error Fetching User with Token")
    }
})

// works
// Handle Image Update/Add
router.put('/update-image/:_id', fileLimiter, upload.single('image'), async (req, res) => {
    const { _id } = req.params;
    const { previousHref, field } = req.body;
    const newFile = req.file;  // Multer middleware adds file details to `req.file`
    console.log(newFile);
    try {
        // 1. Fetch the user by _id and ensure it exists
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // 2. If there's a previousHref, delete the old image
        if (previousHref) {
            // Extract the file path from the previousHref to delete the image
            const oldFilePath = decodeURIComponent(previousHref.split('/o/')[1].split('?')[0]);
            await deleteFile(oldFilePath); // Use your deleteFile function to remove the old image
            console.log(`Deleted old image at: ${oldFilePath}`);
        }

        // 3. Add the new image to Firebase Storage
        if (!newFile) {
            return res.status(400).json({ message: 'No new image file provided' });
        }

        // Set the destination path for the new image in Firebase Storage
        const newDestination = `images/${_id}/${newFile.originalname}`;
        const newImageUrl = await addImage(newFile.buffer, newDestination); // Upload the new image and get the public URL

        // 4. Save the new image URL to the user document in MongoDB
        if (field === 'headshot'){
            user.headshot = newImageUrl; 
        }else if (field === 'banner'){
            user.banner = newImageUrl; 
        }
        await user.save();  // Save the updated user document

        return res.status(200).json({ message: "Successfully updated image", newImageUrl });
    } catch (error) {
        console.error('Error updating image:', error);
        return res.status(500).json({ message: 'Failed to update image.', error });
    }
});

// works
// Update password
router.put('/update-password/:email', ensureAuthenticated, async (req, res) => {
    try {
        const { email } = req.params;
        const { oldPassword, newPassword } = req.body;

        // Validate new password
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send('User not found.');

        if (!passwordCompare(oldPassword, user.password)) return res.status(500).send('Old passwords do not match.');

        // Set new password
        user.password = hashPassword(newPassword);
        await user.save(); // Save updated user
        res.status(200).send("success");
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error, message: "Failed to update password" });
    }
});

// works
// Update email
router.put('/update-email/:currentEmail', ensureAuthenticated, async (req, res) => {
    try {
        const { currentEmail } = req.params;
        const { newEmail, password } = req.body;
        console.log(newEmail, password);
        const lowerCaseEmail = newEmail.toLowerCase();

        // Validate new email
        const user = await User.findOne({ email: currentEmail });
        if (!user) return res.status(400).send('User not found');
        if (!passwordCompare(password, user.password)) return res.status(500).send('Passwords do not match.');

        // Check if new email is already associated with another account
        const existingUser = await User.findOne({ email: lowerCaseEmail });
        if (existingUser) return res.status(500).send('User already registered');

        // Update the email
        user.email = lowerCaseEmail;
        await user.save();
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(400).send("Failed Updating Email");
    }
});

// needs testing
// Update info
router.put('/update-user/:_id', ensureAuthenticated, async (req, res) => {

    const { _id } = req.params;
    const { newInfo } = req.body;
    console.log(newInfo);

    try {
        const updatedUser = await User.findByIdAndUpdate(
            {_id},
            {
                $set: {
                    phone: newInfo.phone,
                    location: newInfo.location,
                    title: newInfo.title,
                    fname: newInfo.fname,
                    lname: newInfo.lname,
                },
            },
        );

        if (!updatedUser) {
            return res.status(404).send("User not found.");
        }

        return res.status(200).send("Success updating user info.");
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to update user.', error });
    }
});

// works
// Login Function
router.post("/login", loginLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Retrieve User if Exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send('User not found');

        // Compare Passwords
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).send('Invalid password');

        // Generate and Save Token
        sendTokenResponse(user, res); // response return executes in this function
    } catch (error) {
        console.log(error);
        res.status(500).send('Error logging in');
    }
});

// works
// Logout
router.post("/logout/:_id", ensureAuthenticated, async (req, res) => {
    const { _id } = req.params;
    try {
        // Remove the authToken from the database
        const user = await User.findOne({_id});
        if (!user) return res.status(400).send('User not found');

        user.authToken = null;
        await user.save();
        res.status(200).send('Logged out');

    } catch (error) {
        console.log(error);
        res.status(500).send('Error logging out');
    }
});


router.post('/create', upload.single('image'), async (req, res) => {
    try {
        const user = new User({
            fname: 'Justin',
            lname: 'Cote',
            title: 'Software Developer',
            email: 'justin.cote25@gmail.com',
            password: hashPassword('lacrosse252232'),
            siteToken: process.env.SITE_TOKEN,
            location: 'Philadelphia Area',
            phone: '(610) 739-0861',
        });

        await user.save();
        return res.status(201).send('User Registered Successfully');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Error registering user');
    }
});

module.exports = router;