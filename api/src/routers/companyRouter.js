import "dotenv/config";
import express from "express";
import authenticateToken from "../../middlewares/authenticateToken.js";
import authorizeRole from "../../middlewares/authorizeRole.js";
import { createCompany } from "../../controllers/companyController.js";
import { getCompaniesByRecruiter } from "../../controllers/companyController.js";
import { createCompanySchema } from "../validate/validator.js";
import { validateRequest } from "../validate/validator.js";

const companyRouter = express.Router();

companyRouter.post(
  "/",
  authenticateToken,
  authorizeRole("recruiter"),
  validateRequest(createCompanySchema),
  createCompany
);
companyRouter.get(
  "/all",
  authenticateToken,
  authorizeRole("recruiter"),
  getCompaniesByRecruiter
);
export default companyRouter;
