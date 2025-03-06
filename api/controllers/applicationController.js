import Application from "../models/application-model.js";
import Job from "../models/job-model.js";
import User from "../models/user-model.js";
import Company from "../models/company-model.js";

const generateS3Url = (fileKey) => {
  const baseUrl = process.env.AWS_S3_BASE_URL;
  return `${baseUrl}/${fileKey}`;
};

const createApplication = async (req, res) => {
  const userId = req.user.sub;
  const jobId = req.params.id;
  const { name, email, resume } = req.body;
  try {
    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(403).json({ message: "Job is not found" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(403).json({ message: "User is not found" });
    }

    if (user.name !== name && user.email !== email) {
      return res
        .status(403)
        .json({ message: "The fields provided does not match" });
    }

    const existingApplication = await Application.findOne({
      where: { userId, jobId },
    });

    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "User has already applied for this job" });
    }

    const newApplication = await Application.create({
      userId,
      jobId,
      resumeKey: resume,
      status: "pending",
    });
    res.status(200).json({
      message: "Application created successfully",
      application: newApplication,
    });
  } catch (error) {
    console.error("Error applying for a job:", error);
    res.status(500).json({ error: "Failed to apply for a job" });
  }
};

//get all jobs applied by a particular job seeker
const getAllAppliedJobs = async (req, res) => {
  try {
    const userId = req.user.sub;
    if (!userId) {
      return res.status(401).json({ message: "Invalid ID" });
    }

    const applications = await Application.findAll({
      where: { userId },
      attributes: ["status", "createdAt", "jobId", "userId"],
      include: [
        {
          model: Job,
          as: "job",
          attributes: ["title"],
          include: [
            {
              model: Company,
              as: "company",
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    if (applications.length === 0) {
      return res
        .status(404)
        .json({ message: "You have not applied for any job yet" });
    }

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching jobs", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

const getAllApplicantsByJobID = async (req, res) => {
  const jobId = req.params.id;
  if (!jobId) {
    return res.status(403).json({ message: "Job ID is missing" });
  }

  try {
    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(403).json({ message: "job not found or invalid" });
    }

    const applicants = await Application.findAll({
      where: { jobId },
      include: {
        model: User,
        as: "user",
        attributes: ["name", "email"],
      },
      attributes: ["id", "resumeKey", "createdAt", "status", "userId"],
    });

    if (applicants.length === 0) {
      return res.status(404).json({ message: "No one has applied yet" });
    }

    const applicantsWithResumeUrl = applicants.map((applicant) => ({
      ...applicant.dataValues,
      resumeUrl: applicant.resumeKey
        ? generateS3Url(applicant.resumeKey)
        : null,
    }));
    res.status(200).json(applicantsWithResumeUrl);
  } catch (error) {
    console.error("Error fetching jobs", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

const updateApplication = async (req, res) => {
  const userId = req.user.sub;
  const jobId = req.params.id;
  const { applicantId } = req.params;
  const { status } = req.body;

  if (!jobId || !applicantId) {
    return res
      .status(403)
      .json({ message: "Application not found  or invalid." });
  }
  try {
    const application = await Application.findOne({
      where: { id: applicantId, jobId },
    });
    if (!application) {
      return res.status(403).json({ message: "Application was not found" });
    }
    if (!status) {
      return res.status(400).json({ message: "Status is required." });
    }

    application.status = status.toLowerCase();
    await application.save();
    res.status(200).json({ message: "Updated successfully", application });
  } catch (error) {
    console.error("Error updating application", error);
    res.status(500).json({ error: "Failed to update application" });
  }
};

const deleteJob = async (req, res) => {
  const jobId = req.params.id;

  try {
    const job = await Job.findByPk(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Delete related applications first (this is optional due to CASCADE)
    await Application.destroy({ where: { jobId } });

    // Now, delete the job itself
    await job.destroy();

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "Failed to delete job" });
  }
};

export {
  createApplication,
  getAllAppliedJobs,
  updateApplication,
  getAllApplicantsByJobID,
  deleteJob,
};
