
const { z } = require("zod");

const ResumeSchema = z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),

    education: z.array(
        z.object({
            degree: z.string(),
            institution: z.string(),
            field: z.string(),
            graduationYear: z.string()
        })
    ),

    skills: z.array(z.string()),

    projects: z.array(
        z.object({
            name: z.string(),
            description: z.string(),
            technologies: z.array(z.string())
        })
    ),

    experience: z.array(
        z.object({
            company: z.string(),
            role: z.string(),
            duration: z.string()
        })
    )
});

module.exports = {
    ResumeSchema
};
