const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Construct the relative path to the directory where contract files will be saved
const uploadDir = path.join(__dirname, "../../../shared");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const { projectId } = req.body;
    if (!projectId) {
      return "Not found";
    }

    const projectPath = path.join(uploadDir, projectId);
    const contractPath = path.join(projectPath, "contract");

    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath, { recursive: true });
    }

    if (!fs.existsSync(contractPath)) {
      fs.mkdirSync(contractPath);
    }

    callback(null, contractPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
