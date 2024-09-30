const { getStorageBucket } = require('./firestore_assist');

// add an image to Firebase Storage
async function addImage(fileBuffer, destination) {
  try {
      const bucket = getStorageBucket();

      // Create a file reference in the bucket
      const file = bucket.file(destination);

      // Upload the file from the buffer
      await file.save(fileBuffer, {
          contentType: 'image', // or the appropriate content type
          resumable: false,
      });

      // Create a public URL for the uploaded image
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(destination)}?alt=media`;

      console.log('Image uploaded successfully:', publicUrl);
      return publicUrl; // Return the public URL of the image
  } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error('Failed to upload image');
  }
}

// add a PDF to Firebase Storage
async function addPDF(fileBuffer, destination) {
  try {
      const bucket = getStorageBucket();
      const file = bucket.file(destination);
      await file.save(fileBuffer, {
          contentType: 'application/pdf', // or the appropriate content type
          resumable: false,
      });
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(destination)}?alt=media`;
      console.log('PDF uploaded successfully:', publicUrl);
      return publicUrl; // Return the public URL of the image
  } catch (error) {
      console.error("Error uploading PDF:", error);
      throw new Error('Failed to upload PDF');
  }
}

// add an MP4 to Firebase Storage
async function addMP4(fileBuffer, destination) {
  try {
      const bucket = getStorageBucket();

      // Create a file reference in the bucket
      const file = bucket.file(destination);

      // Upload the file from the buffer
      await file.save(fileBuffer, {
          contentType: 'video/mp4', // Content type for MP4
          resumable: false,
      });

      // Create a public URL for the uploaded video
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(destination)}?alt=media`;

      console.log('MP4 uploaded successfully:', publicUrl);
      return publicUrl; // Return the public URL of the MP4 file
  } catch (error) {
      console.error("Error uploading MP4:", error);
      throw new Error('Failed to upload MP4');
  }
}

// delete an image from Firebase Storage
async function deleteFile(filePath) {
  try {
    const bucket = getStorageBucket();
    
    // Delete the file from the bucket
    const file = bucket.file(filePath);
    await file.delete();

    console.log('File deleted successfully:', filePath);
  } catch (error) {
    console.error("Error deleting File:", error);
    throw new Error('Failed to delete File');
  }
}



module.exports = {
  addImage,
  addPDF,
  addMP4,
  deleteFile
};
