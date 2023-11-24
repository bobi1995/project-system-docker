const multer = require("multer");
const fs = require("fs");
const path = require("path");
const uploadDir = path.join(__dirname, "../../../shared");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const { projectId } = req.body;
    console.log(projectId);
    if (!projectId) {
      return "Not found";
    }

    const projectPath = path.join(uploadDir, projectId);
    const simulationPath = path.join(projectPath, "simulation");

    console.log(file.filename);
    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath, { recursive: true });
    }

    if (!fs.existsSync(simulationPath)) {
      fs.mkdirSync(simulationPath);
    }

    callback(null, simulationPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = upload;
