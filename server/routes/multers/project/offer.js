const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Construct the relative path to the directory where offer files will be saved
const uploadDir = path.join(__dirname, "../../../shared");

const storageOffer = multer.diskStorage({
  destination: (req, file, callback) => {
    const { projectId } = req.body;
    if (!projectId) {
      return "Not found";
    }

    const projectPath = path.join(uploadDir, projectId);
    const offerPath = path.join(projectPath, "offer");

    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath, { recursive: true });
    }

    if (!fs.existsSync(offerPath)) {
      fs.mkdirSync(offerPath);
    }

    callback(null, offerPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const uploadOffer = multer({ storage: storageOffer });

module.exports = uploadOffer;
