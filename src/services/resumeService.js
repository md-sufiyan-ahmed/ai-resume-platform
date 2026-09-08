const fs = require("fs");
const path = require("path");
const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");

async function extractResumeText(file) {

    const filePath = file.path;

    try {

        const fileType = file.mimetype;

        const fileExtension = path
            .extname(file.originalname)
            .toLowerCase();

        console.log("FILE TYPE:", fileType);
        console.log("FILE EXTENSION:", fileExtension);
        console.log("ORIGINAL NAME:", file.originalname);

        if (
            fileType === "application/pdf" ||
            fileExtension === ".pdf"
        ) {

            const fileBuffer = fs.readFileSync(filePath);

            const parser = new PDFParse({
                data: fileBuffer
            });

            const pdfData = await parser.getText();

            await parser.destroy();

            return pdfData.text;
        }

        if (
            fileType ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            fileExtension === ".docx"
        ) {

            const result = await mammoth.extractRawText({
                path: filePath
            });

            return result.value;
        }

        throw new Error("Only PDF and DOCX files are supported");

    } finally {

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log("Temporary file deleted");
        }
    }
}

module.exports = {
    extractResumeText
};