// utils/deleteFile.js
const fs = require("fs");
const path = require("path");
const ProjectModel = require("../../mongoModels/project");

// Construct the relative path to the directory where invoice files will be saved
const uploadDir = path.join(__dirname, "../../shared");

const deleteFileAndRemoveFromProject = async (projectId, fileName, field) => {
  const project = await ProjectModel.findById(projectId);
  if (!project) {
    throw new Error("Project not found");
  }

  const filePath = `${uploadDir}/${projectId}/${field}/${fileName}`;

  fs.unlinkSync(filePath);

  const index = project[field].indexOf(fileName);
  if (index !== -1) {
    project[field].splice(index, 1);
  }

  await project.save();
};

module.exports = deleteFileAndRemoveFromProject;
