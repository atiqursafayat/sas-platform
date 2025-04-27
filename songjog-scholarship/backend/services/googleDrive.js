const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../credentials.json'),
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

const uploadToGoogleDrive = async (file) => {
  try {
    const fileMetadata = {
      name: file.originalname,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
    };
    const media = {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.path),
    };
    const response = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: 'id',
    });
    fs.unlinkSync(file.path);
    return response.data.id;
  } catch (err) {
    console.error('Google Drive upload failed:', err);
    return null;
  }
};

module.exports = { uploadToGoogleDrive };