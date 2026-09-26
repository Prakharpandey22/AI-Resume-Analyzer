const express = require("express");

const authMiddleware = require("../middlewares/auth.middleware");
const interviewController = require("../controllers/interview.controllers");
const upload = require("../middlewares/file.middleware");

const interviewRouter = express.Router();



/**
 * POST /api/interview
 */
interviewRouter.post(
    "/",
    authMiddleware.authUser,
    upload.single("resume"),
    interviewController.generateInterviewReportController
);

/**
 * GET /api/interview/report/:interviewId
 */
interviewRouter.get(
    "/report/:interviewId",
    authMiddleware.authUser,
    interviewController.getInterviewReportByIdController
);

/**
 * GET /api/interview
 */
interviewRouter.get(
    "/",
    authMiddleware.authUser,
    interviewController.getAllInterviewReportsController
);

/**
 * POST /api/interview/resume/pdf/:interviewReportId
 * Later
 */
interviewRouter.post(
    "/resume/pdf/:interviewReportId",
    authMiddleware.authUser,
    interviewController.generateResumePdfController
);

module.exports = interviewRouter;