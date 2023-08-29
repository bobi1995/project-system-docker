const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Construct the relative path to the directory where picture files will be saved
const uploadDir = path.join(__dirname, "../../../shared");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const { projectId } = req.body;
    if (!projectId) {
      return "Not found";
    }

    const projectPath = path.join(uploadDir, projectId);
    const picturesPath = path.join(projectPath, "pictures");

    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath, { recursive: true });
    }

    if (!fs.existsSync(picturesPath)) {
      fs.mkdirSync(picturesPath);
    }

    callback(null, picturesPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const uploadPictures = multer({ storage: storage });

module.exports = uploadPictures;
