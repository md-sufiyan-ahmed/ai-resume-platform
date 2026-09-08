const express = require("express");
const multer = require("multer");

const {
    uploadResume
} = require("../controllers/resumeController");

const router = express.Router();

const upload = multer({
    dest: "uploads/",

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only PDF and DOCX files are allowed"));
        }
    }
});

router.post(
    "/upload",
    upload.single("resume"),
    uploadResume
);

module.exports = router;