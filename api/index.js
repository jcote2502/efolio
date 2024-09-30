const express = require('express');
require('dotenv').config();
const { connectDB } = require('./utils/db_assist');
const { connectFirestore, uploadImageToBucket } = require('./utils/firestore_assist');
const app = express();
const cors = require('cors');
const path = require('path');

connectDB().catch(console.dir);
connectFirestore().catch(error => {
    console.error('error adding image', error);
});

app.use(express.json());

app.use(cors());

app.use("/api", require("./controllers"));

// Serve static files from the React app build
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    // Handle any other requests and serve the React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
