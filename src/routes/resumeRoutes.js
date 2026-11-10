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
        console.log("Received MIME type:", file.mimetype);
        console.log("Received filename:", file.originalname);


        const isPDF = file.mimetype === "application/pdf";

        const isDOCX =
            file.mimetype ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            (
                file.mimetype === "application/octet-stream" &&
                file.originalname.toLowerCase().endsWith(".docx")
            );

        if (isPDF || isDOCX) {
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