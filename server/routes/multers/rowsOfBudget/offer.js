const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Construct the relative path to the directory where offer files will be saved
const uploadDir = path.join(__dirname, "../../../shared");

const storageOffer = multer.diskStorage({
  destination: (req, file, callback) => {
    const { rowId, projectId } = req.body;
    if (!rowId || !projectId) {
      return "Not found";
    }

    const projectPath = path.join(uploadDir, projectId);
    const budgetRowsPath = path.join(projectPath, "budgetRows");

    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath, { recursive: true });
    }

    if (!fs.existsSync(budgetRowsPath)) {
      fs.mkdirSync(budgetRowsPath);
    }

    const individualRowPath = path.join(budgetRowsPath, rowId);

    if (!fs.existsSync(individualRowPath)) {
      fs.mkdirSync(individualRowPath);
    }

    const offerPath = path.join(individualRowPath, "offer");

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
