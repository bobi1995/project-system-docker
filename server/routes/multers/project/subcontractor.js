const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Construct the relative path to the directory where subcontractor files will be saved
const uploadDir = path.join(__dirname, "../../../shared");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const { projectId } = req.body;
    if (!projectId) {
      return "Not found";
    }

    const projectPath = path.join(uploadDir, projectId);
    const subcontractorPath = path.join(projectPath, "subcontractor");

    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath, { recursive: true });
    }

    if (!fs.existsSync(subcontractorPath)) {
      fs.mkdirSync(subcontractorPath);
    }

    callback(null, subcontractorPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const uploadSubcontractor = multer({ storage: storage });

module.exports = uploadSubcontractor;
