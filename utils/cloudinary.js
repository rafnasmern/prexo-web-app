require('dotenv')
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: "brototypes",
    api_key: "711765693858428",
    api_secret: "gZePmacVzCUCKvHdRAc3TIlMPf0",
})

module.exports = { cloudinary }