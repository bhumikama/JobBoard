import "dotenv/config";
import express from "express";
import authenticateToken from "../../middlewares/authenticateToken.js";
import authorizeRole from "../../middlewares/authorizeRole.js";
import { createJob } from "../../controllers/jobController.js";
import { getAllJobs } from "../../controllers/jobController.js";
import { getJobById } from "../../controllers/jobController.js";
import { getAllApplicantsByJobID } from "../../controllers/applicationController.js";
import { getAllAppliedJobs } from "../../controllers/applicationController.js";
import { createApplication } from "../../controllers/applicationController.js";
import { getJobsByRecruiter } from "../../controllers/jobController.js";
import { updateApplication } from "../../controllers/applicationController.js";
import { validateRequest } from "../validate/validator.js";
import { addJobSchema } from "../validate/validator.js";
import { deleteJob } from "../../controllers/applicationController.js";

const jobRouter = express.Router();

jobRouter.post(
  "/",
  authenticateToken,
  authorizeRole("recruiter"),
  validateRequest(addJobSchema),
  createJob
);
jobRouter.get("/", getAllJobs);
jobRouter.get(
  "/all",
  authenticateToken,
  authorizeRole("job_seeker"),
  getAllAppliedJobs
);
jobRouter.get(
  "/recruiter/all",
  authenticateToken,
  authorizeRole("recruiter"),
  getJobsByRecruiter
);
jobRouter.get("/:id", getJobById);
jobRouter.delete(
  "/:id",
  authenticateToken,
  authorizeRole("recruiter"),
  deleteJob
);
jobRouter.get(
  "/:id/applicants",
  authenticateToken,
  authorizeRole("recruiter"),
  getAllApplicantsByJobID
);
jobRouter.post(
  "/:id/apply",
  authenticateToken,
  authorizeRole("job_seeker"),
  createApplication
);
jobRouter.put(
  "/:id/applicants/:applicantId",
  authenticateToken,
  authorizeRole("recruiter"),
  updateApplication
);

export default jobRouter;
