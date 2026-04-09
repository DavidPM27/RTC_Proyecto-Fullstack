const cloudinary = require("cloudinary").v2;

const connectCloudinary = () => {
    try {
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_secret: process.env.CLOUDINARY_API_SECRET,
          api_key: process.env.CLOUDINARY_API_KEY,
        });
        console.log("Connected to Cloudinary succesfully");
    } catch (error) {
        console.log("Error connecting to Cloudinary: ", error);
    }
};

module.exports = { connectCloudinary };
