const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Construct the relative path to the directory where standpoint files will be saved
const uploadDir = path.join(__dirname, "../../../shared");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const { projectId } = req.body;
    if (!projectId) {
      return "Not found";
    }

    const projectPath = path.join(uploadDir, projectId);
    const standpointPath = path.join(projectPath, "standpoint");

    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath, { recursive: true });
    }

    if (!fs.existsSync(standpointPath)) {
      fs.mkdirSync(standpointPath);
    }

    callback(null, standpointPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const standpoint = multer({ storage: storage });

module.exports = standpoint;
