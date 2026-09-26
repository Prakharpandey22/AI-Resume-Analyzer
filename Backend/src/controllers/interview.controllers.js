

/**
 * 
 * @description Controller to generate interview report based on user self description, resume and job description
 * 
 */


// async function generateInterviewReportController(req,res){
      
//       const pdfData = await pdfParse(req.file.buffer);
//     const resumeContentText = pdfData.text;


//       const {selfDescription,jobDescription} = req.body

//       const interviewReportByAi = await generateInterviewReport({
//         resume: resumeContentText,
//         selfDescription,
//         jobDescription
//       })

//       const interviewReport = await interviewReportModel.create({
//         user: req.user.id,
//         resume:resumeContent.text,
//         selfDescription,
//         jobDescription,
//         ...interviewReportByAi
//       })

//       res.status(201).json({
//         message:"Interview report generated successfully",
//         interviewReport
//       })

// }
const pdfParse = require("pdf-parse");
const {generateInterviewReport,generateResumePdf} = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

async function generateInterviewReportController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Resume PDF zaroori hai." });
        }

        // v1.1.1 me direct function call hoti hai Buffer ke sath
        const parsedPdf = await pdfParse(req.file.buffer);
        const resumeText = parsedPdf.text;

        const { selfDescription, jobDescription } = req.body;

        if (!jobDescription) {
            return res.status(400).json({ message: "Job description zaroori hai." });
        }

        console.log("Extracted Resume Text Length:", resumeText.length);
        console.log("Calling Gemini AI...");

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription: selfDescription || "",
            jobDescription
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        });

        return res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        });

    } catch (error) {
        console.error("Error in generateInterviewReportController:", error);
        return res.status(500).json({ 
            message: error.message || "Internal server error" 
        });
    }
}

async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params;

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.id
        });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            });
        }

        return res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch interview report." });
    }
}

async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

        return res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch interview reports." });
    }
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = { generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }