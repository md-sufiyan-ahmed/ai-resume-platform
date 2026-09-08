const {
    extractResumeText
} = require("../services/resumeService");

async function uploadResume(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No resume uploaded"
            });
        }

        const extractedText =
            await extractResumeText(req.file);

        if (!extractedText || extractedText.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Could not extract readable text from the resume"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Resume uploaded and text extracted successfully",
            filename: req.file.originalname,
            text: extractedText
        });

    } catch (error) {
        console.error("Resume processing error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to process resume"
        });
    }
}

module.exports = {
    uploadResume
};