const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Construct the relative path to the directory where permission files will be saved
const uploadDir = path.join(__dirname, "../../../shared");

const storagePermission = multer.diskStorage({
  destination: (req, file, callback) => {
    const { projectId } = req.body;
    if (!projectId) {
      return "Not found";
    }

    const projectPath = path.join(uploadDir, projectId);
    const permissionPath = path.join(projectPath, "permission");

    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath, { recursive: true });
    }

    if (!fs.existsSync(permissionPath)) {
      fs.mkdirSync(permissionPath);
    }

    callback(null, permissionPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const permission = multer({ storage: storagePermission });

module.exports = permission;
