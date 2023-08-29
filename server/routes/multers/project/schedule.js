const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Construct the relative path to the directory where schedule files will be saved
const uploadDir = path.join(__dirname, "../../../shared");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const { projectId } = req.body;
    if (!projectId) {
      return "Not found";
    }

    const projectPath = path.join(uploadDir, projectId);
    const schedulePath = path.join(projectPath, "schedule");

    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath, { recursive: true });
    }

    if (!fs.existsSync(schedulePath)) {
      fs.mkdirSync(schedulePath);
    }

    callback(null, schedulePath);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const uploadSchedule = multer({ storage: storage });

module.exports = uploadSchedule;
