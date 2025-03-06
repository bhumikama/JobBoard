import Company from "../models/company-model.js";

const generateS3Url = (fileKey) => {
  const baseUrl = process.env.AWS_S3_BASE_URL;
  return `${baseUrl}/${fileKey}`;
};

const createCompany = async (req, res) => {
  const recruiterId = req.user.sub;
  const { name, website, location, imageKey } = req.value.body;

  if (!name || !website || !location || !imageKey) {
    return res.status(400).json({ message: "Some fields are missing" });
  }
  try {
    const existingCompany = await Company.findOne({ where: { name } });
    if (existingCompany) {
      return res.status(403).json({ error: "Company name must be unique." });
    }

    const company = await Company.create({
      name,
      website,
      location,
      imageKey,
      recruiterId,
    });

    return res.status(200).json(company);
  } catch (error) {
    console.error("Error creating the company", error);
    res.status(500).json({ error: "Error creating the company" });
  }
};

const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll();
    if (companies.length == 0) {
      return res.status(404).json({ message: "No companies found" });
    }

    const companiesWithUrls = companies.map((company) => ({
      ...company.dataValues,
      imageUrl: generateS3Url(company.imageKey),
    }));

    return res.status(200).json(companiesWithUrls);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ error: "Failed to fetch companies" });
  }
};

const getCompaniesByRecruiter = async (req, res) => {
  try {
    const recruiterId = req.user.sub;
    if (!recruiterId) {
      return res.status(403).json({ message: "Invalid ID" });
    }

    // Fetch all companies for this instructor
    const companies = await Company.findAll({
      where: { recruiterId },
      attributes: [
        "id",
        "name",
        "website",
        "location",
        "imageKey",
        "createdAt",
      ],
    });

    if (companies.length === 0) {
      return res
        .status(404)
        .json({ message: "You have not created any companies yet" });
    }

    //Add full S3 URL for each company
    const companiesWithUrls = companies.map((company) => ({
      ...company.dataValues,
      imageUrl: generateS3Url(company.imageKey),
    }));

    res.status(200).json(companiesWithUrls);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ error: "Failed to fetch companies" });
  }
};

const getCompanyById = async (req, res) => {
  const { id } = req.params;

  try {
    const company = await Company.findByPk(id, {
      attributes: ["id", "name", "website", "location"],
    });
    if (!company) {
      return res.status(404).json({ message: "Company is not found" });
    }
    res.status(200).json(company);
  } catch (error) {
    console.error("Error fetching company:", error);
    res.status(500).json({ error: "Failed to fetch company" });
  }
};

export {
  createCompany,
  getAllCompanies,
  getCompaniesByRecruiter,
  getCompanyById,
};
