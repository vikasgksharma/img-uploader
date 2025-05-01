const express = require('express');
const multer = require('multer');
const dotenv = require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const cors=require('cors');

const app = express();
const upload = multer({dest:'uploads/'});

app.use(cors({
  origin:'*' //allow all origins
}));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.static('public'));

app.post('/upload', upload.single('image'), async(req, res) =>{
    try { 
      const result= await cloudinary.uploader.upload(req.file.path,{
        folder:'uploads' //folder name in cloudinary
      });
//delete the file from local storage after upload
      fs.unlinkSync(req.file.path);
      res.json({
        message:'File uploaded successfully',
        file: result.secure_url //url of the uploaded file
      });
  } catch (error) {

      console.error(error);
      res.status(500).json({
        message:'File upload failed',
        error:error.message
      })}
    });
 //start the server
  app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
  });

