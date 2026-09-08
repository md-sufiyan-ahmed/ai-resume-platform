const express = require("express");
const multer = require("multer");

const resumeRoutes = require("./routes/resumeRoutes");

const app = express();

const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("AI Resume Parser API is running");
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Server is healthy"
    });
});

app.use("/api/resume", resumeRoutes);

app.use((err, req, res, next) => {

    console.error(err);

    if (err instanceof multer.MulterError) {

        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                success: false,
                message: "File size must be less than 5 MB"
            });
        }

        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    if (err.message === "Only PDF and DOCX files are allowed") {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});