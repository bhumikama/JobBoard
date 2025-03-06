import Joi from "joi";

export const signUpSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } }) // Validate email format without restricting TLDs
    .required(),

  password: Joi.string().min(8).max(20).required(),
  name: Joi.string()
    .pattern(/^[a-zA-Z ]+$/)
    .min(3)
    .max(30)
    .required(),

  role: Joi.string().valid("recruiter", "job_seeker").required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const addJobSchema = Joi.object({
  companyId: Joi.number().integer().required(),
  title: Joi.string().min(3).max(255).trim().required(), 
  description: Joi.string().min(10).trim().required(), 
  location: Joi.string()
    .min(3)
    .max(100)
    .pattern(/^[a-zA-Z\s,]+$/) 
    .trim() 
    .required(),
  category: Joi.string()
    .valid("Engineering & Technology", "Management", "IT")
    .trim() 
    .required(),
  salary: Joi.number().min(0).required(), 
  type: Joi.string().valid("remote", "in-office").required(), 
});

export const createCompanySchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  website: Joi.string().uri().required(),
  location: Joi.string().trim().min(1).required(),
  imageKey: Joi.string().trim().required(),
});

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
      console.error(error.details[0].message);
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    if (!req.value) {
      req.value = {};
    }

    req.value["body"] = value;
    next();
  };
};
