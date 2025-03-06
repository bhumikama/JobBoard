import Job from "../models/job-model.js";
import { Op } from "sequelize";
import Company from "../models/company-model.js";

const generateS3Url = (fileKey) => {
  const baseUrl = process.env.AWS_S3_BASE_URL;
  return `${baseUrl}/${fileKey}`;
};

const createJob = async (req, res) => {
  const recruiterId = req.user.sub;
  const { title, description, location, category, salary, type, companyId } =
    req.value.body;

  try {
    const getRecruiter = await Company.findOne({
      where: { id: companyId, recruiterId: req.user.sub },
    });
    if (!getRecruiter) {
      return res
        .status(400)
        .json({ message: "You can only create jobs for your own company" });
    }

    const job = await Job.create({
      title,
      description,
      category,
      location,
      salary: Number(salary),
      type,
      companyId,
      created_by: recruiterId,
    });

    return res.status(200).json(job);
  } catch (error) {
    console.error("Error creating the job", error);
    res.status(500).json({ error: "Error creating the job" });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const {
      category,
      minSalary,
      maxSalary,
      title,
      sortBy = "salary",
      order = "ASC",
      type,
      page = 1,
      limit = 10,
    } = req.query;

    const whereClause = {};

    if (title) {
      whereClause.title = { [Op.iLike]: `%${title}%` };
    }
    if (category) {
      whereClause.category = category;
    }
    if (type) {
      whereClause.type = type;
    }
    if (minSalary || maxSalary) {
      whereClause.salary = {};
      if (minSalary) whereClause.salary[Op.gte] = Number(minSalary);
      if (maxSalary) whereClause.salary[Op.lte] = Number(maxSalary);
    }

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.max(1, parseInt(limit, 10) || 10);
    const offset = (pageNumber - 1) * pageSize;

    const validSortColumns = ["salary", "title", "category"];
    const orderBy = validSortColumns.includes(sortBy)
      ? [[sortBy, order.toUpperCase() === "DESC" ? "DESC" : "ASC"]]
      : [["salary", "ASC"]];

    const { count, rows: Jobs } = await Job.findAndCountAll({
      where: whereClause,
      attributes: [
        "id",
        "title",
        "description",
        "salary",
        "location",
        "category",
        "type",
        "createdAt",
      ],
      order: orderBy,
      limit: pageSize,
      offset: offset,
      include: {
        model: Company,
        as: "company",
        attributes: ["name", "location", "createdAt", "imageKey"],
      },
    });

    if (!Jobs.length) {
      return res.status(404).json({ message: "No jobs found" });
    }

    const JobsWithUrls = Jobs.map((job) => ({
      ...job.dataValues,
      imageUrl: job.company?.imageKey
        ? generateS3Url(job.company.imageKey)
        : null,
    }));

    return res.status(200).json({
      totalJobs: count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: pageNumber,
      jobs: JobsWithUrls,
    });
  } catch (error) {
    console.error("Error fetching the jobs", error);
    return res.status(500).json({ error: "Error fetching the jobs" });
  }
};

const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id, {
      include: [
        {
          model: Company,
          as: "company",
          attributes: ["name", "location", "createdAt", "imageKey", "website"],
        },
      ],
      attributes: [
        "id",
        "createdAt",
        "title",
        "salary",
        "location",
        "description",
        "category",
        "type",
      ],
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const JobWithUrl = {
      ...job.toJSON(),
      imageUrl: generateS3Url(job.company.imageKey),
    };
    res.status(200).json(JobWithUrl);
  } catch (error) {
    console.error("Error fetching Job by ID:", error);
    res.status(500).json({ error: "An error occurred while fetching the Job" });
  }
};

const getJobsByRecruiter = async (req, res) => {
  try {
    const recruiterId = req.user.sub;
    if (!recruiterId) {
      return res.status(403).json({ message: "Invalid ID" });
    }

    const jobs = await Job.findAll({
      include: {
        model: Company,
        as: "company",
        where: { recruiterId },
        attributes: ["name"],
      },
    });

    if (jobs.length === 0) {
      return res
        .status(404)
        .json({ message: "No jobs found for this recruiter" });
    }
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ error: "Failed to fetch companies" });
  }
};

export { createJob, getAllJobs, getJobById, getJobsByRecruiter };
