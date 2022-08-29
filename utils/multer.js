const multer = require("multer")
const path = require("path")

// Multer config

module.exports = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "backend/public/profile")
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + Date.now() + path.extname(file.originalname))
        }
    }),

}) 