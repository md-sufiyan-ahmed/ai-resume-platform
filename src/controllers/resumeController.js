
const {
    extractResumeText
} = require("../services/resumeService");

const {
    analyzeResume
} = require("../services/resumeAnalysisService");

async function uploadResume(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No resume uploaded"
            });
        }

        const extractedText = await extractResumeText(req.file);

        if (!extractedText || extractedText.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Could not extract readable text from the resume"
            });
        }

        const analyzedResume = await analyzeResume(extractedText);

        return res.status(200).json({
            success: true,
            message: "Resume uploaded, extracted and analyzed successfully",
            filename: req.file.originalname,
            text: extractedText,
            resume: analyzedResume
        });

    } catch (error) {
        console.error("Resume processing error:", error);

        if (error.status === 503) {
            return res.status(503).json({
                success: false,
                message: "Resume analysis service is temporarily unavailable. Please try again later."
            });
        }

        if (error.status === 429) {
            return res.status(429).json({
                success: false,
                message: "Resume analysis rate limit exceeded. Please try again later."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to process resume. Please try again."
        });
    }
}

module.exports = {
    uploadResume
};
