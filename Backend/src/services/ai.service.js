// const Groq = require("groq-sdk");
// const { z } = require("zod");
// const puppeteer = require("puppeteer")

// const groq = new Groq({
//     apiKey: process.env.GROQ_API_KEY
// });

// // Zod Schema verification ke liye
// const interviewReportSchema = z.object({
//     matchScore: z.number().min(0).max(100),
//     technicalQuestions: z.array(
//         z.object({
//             question: z.string(),
//             intention: z.string(),
//             answer: z.string()
//         })
//     ),
//     behavioralQuestions: z.array(
//         z.object({
//             question: z.string(),
//             intention: z.string(),
//             answer: z.string()
//         })
//     ),
//     skillGaps: z.array(
//         z.object({
//             skill: z.string(),
//             severity: z.enum(["low", "medium", "high"])
//         })
//     ),
//     preparationPlan: z.array(
//         z.object({
//             day: z.number(),
//             focus: z.string(),
//             tasks: z.array(z.string())
//         })
//     ),
//     title: z.string()
// });

// async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
//     console.log("🔥 Groq AI: generateInterviewReport CALLED");

//     const prompt = `
// You are an expert technical interviewer.
// Analyze the candidate's resume, self description, and job description to generate an interview preparation report.

// IMPORTANT:
// Return ONLY valid JSON matching this exact structure:
// {
//     "matchScore": 85,
//     "technicalQuestions": [
//         {
//             "question": "Sample technical question?",
//             "intention": "Why this question is asked",
//             "answer": "How to answer it"
//         }
//     ],
//     "behavioralQuestions": [
//         {
//             "question": "Sample behavioral question?",
//             "intention": "Why this question is asked",
//             "answer": "How to answer it"
//         }
//     ],
//     "skillGaps": [
//         {
//             "skill": "React",
//             "severity": "medium"
//         }
//     ],
//     "preparationPlan": [
//         {
//             "day": 1,
//             "focus": "Core concepts",
//             "tasks": ["Task 1", "Task 2"]
//         }
//     ],
//     "title": "Job Title"
// }

// CANDIDATE RESUME:
// ${resume}

// CANDIDATE SELF DESCRIPTION:
// ${selfDescription || "Not provided"}

// JOB DESCRIPTION:
// ${jobDescription}
// `;

//     try {
//         const chatCompletion = await groq.chat.completions.create({
//             messages: [
//                 {
//                     role: "system",
//                     content: "You are a professional hiring manager. You output ONLY valid raw JSON without any markdown formatting or explanations."
//                 },
//                 {
//                     role: "user",
//                     content: prompt
//                 }
//             ],
//             model: "openai/gpt-oss-120b",
//             response_format: { type: "json_object" }
//         });

//         const rawText = chatCompletion.choices[0]?.message?.content;
//         console.log("✅ Groq response received");

//         const result = JSON.parse(rawText);
//         const validatedResult = interviewReportSchema.parse(result);

//         console.log("✅ Validated successfully");
//         return validatedResult;

//     } catch (error) {
//         console.error("❌ Groq AI Error:", error);
//         throw error;
//     }
// }

// async function generatePdfFromHtml(htmlContent) {
//     const browser = await puppeteer.launch()
//     const page = await browser.newPage();
//     await page.setContent(htmlContent, { waitUntil: "networkidle0" })

//     const pdfBuffer = await page.pdf({
//         format: "A4", margin: {
//             top: "20mm",
//             bottom: "20mm",
//             left: "15mm",
//             right: "15mm"
//         }
//     })

//     await browser.close()

//     return pdfBuffer
// }

// async function generateResumePdf({ resume, selfDescription, jobDescription }) {

//     const resumePdfSchema = z.object({
//         html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
//     })

//     const prompt = `Generate resume for a candidate with the following details:
//                         Resume: ${resume}
//                         Self Description: ${selfDescription}
//                         Job Description: ${jobDescription}

//                         the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
//                         The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
//                         The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
//                         you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
//                         The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
//                         The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
//                     `

//     const response = await ai.models.generateContent({
//         model: "openai/gpt-oss-120b",
//         contents: prompt,
//         config: {
//             responseMimeType: "application/json",
//             responseSchema: zodToJsonSchema(resumePdfSchema),
//         }
//     })


//     const jsonContent = JSON.parse(response.text)

//     const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

//     return pdfBuffer

// }

// module.exports = {generateInterviewReport,generateResumePdf};

const Groq = require("groq-sdk");
const { z } = require("zod");
const puppeteer = require("puppeteer");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Zod Schema verification ke liye
const interviewReportSchema = z.object({
    matchScore: z.number().min(0).max(100),
    technicalQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ),
    behavioralQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ),
    skillGaps: z.array(
        z.object({
            skill: z.string(),
            severity: z.enum(["low", "medium", "high"])
        })
    ),
    preparationPlan: z.array(
        z.object({
            day: z.number(),
            focus: z.string(),
            tasks: z.array(z.string())
        })
    ),
    title: z.string()
});

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    console.log("🔥 Groq AI: generateInterviewReport CALLED");

    const prompt = `
You are an expert technical interviewer.
Analyze the candidate's resume, self description, and job description to generate an interview preparation report.

IMPORTANT:
Return ONLY valid JSON matching this exact structure:
{
    "matchScore": 85,
    "technicalQuestions": [
        {
            "question": "Sample technical question?",
            "intention": "Why this question is asked",
            "answer": "How to answer it"
        }
    ],
    "behavioralQuestions": [
        {
            "question": "Sample behavioral question?",
            "intention": "Why this question is asked",
            "answer": "How to answer it"
        }
    ],
    "skillGaps": [
        {
            "skill": "React",
            "severity": "medium"
        }
    ],
    "preparationPlan": [
        {
            "day": 1,
            "focus": "Core concepts",
            "tasks": ["Task 1", "Task 2"]
        }
    ],
    "title": "Job Title"
}

CANDIDATE RESUME:
${resume}

CANDIDATE SELF DESCRIPTION:
${selfDescription || "Not provided"}

JOB DESCRIPTION:
${jobDescription}
`;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a professional hiring manager. You output ONLY valid raw JSON without any markdown formatting or explanations."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "openai/gpt-oss-120b",
            response_format: { type: "json_object" }
        });

        const rawText = chatCompletion.choices[0]?.message?.content;
        console.log("✅ Groq response received");

        const result = JSON.parse(rawText);
        const validatedResult = interviewReportSchema.parse(result);

        console.log("✅ Validated successfully");
        return validatedResult;

    } catch (error) {
        console.error("❌ Groq AI Error:", error);
        throw error;
    }
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    });

    await browser.close();
    return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const resumePdfSchema = z.object({
        html: z.string().describe("The complete HTML content of the resume including inline styles")
    });

    const prompt = `
Generate an ATS-friendly, professional resume for a candidate with the following details:
- Candidate Resume: ${resume}
- Candidate Self Description: ${selfDescription || "Not provided"}
- Target Job Description: ${jobDescription}

REQUIREMENTS:
1. Return ONLY a valid JSON object matching: {"html": "<!DOCTYPE html><html>...complete resume markup with CSS...</html>"}
2. Provide complete, valid, self-contained HTML with inline/embedded CSS inside <style> tags.
3. Keep the styling clean, ATS-compliant, and printable on 1-2 pages (A4 size).
4. Do not output markdown, ticks, or text outside the JSON.
 5.  The response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                     6.   The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                     7.   The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                     8.   you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                     9.   The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                     10.   The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description
`;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an expert resume writer. Output ONLY a valid raw JSON object with a single 'html' key containing complete HTML markup."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "openai/gpt-oss-120b",
            response_format: { type: "json_object" }
        });

        const rawText = chatCompletion.choices[0]?.message?.content;
        const parsed = JSON.parse(rawText);
        const validated = resumePdfSchema.parse(parsed);

        const pdfBuffer = await generatePdfFromHtml(validated.html);
        return pdfBuffer;
    } catch (error) {
        console.error("❌ Error generating resume PDF:", error);
        throw error;
    }
}

module.exports = { generateInterviewReport, generateResumePdf };