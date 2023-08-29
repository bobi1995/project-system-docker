const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Construct the relative path to the directory where project document files will be saved
const uploadDir = path.join(__dirname, "../../../shared");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const { projectId } = req.body;
    if (!projectId) {
      return "Not found";
    }

    const projectPath = path.join(uploadDir, projectId);
    const projectDocsPath = path.join(projectPath, "projectDocs");

    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath, { recursive: true });
    }

    if (!fs.existsSync(projectDocsPath)) {
      fs.mkdirSync(projectDocsPath);
    }

    callback(null, projectDocsPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const projectDocs = multer({ storage: storage });

module.exports = projectDocs;
