const fs = require("fs");
const path = require("path");
const BudgetRowsModel = require("../../mongoModels/rowsOfBudget");
const uploadDir = path.join(__dirname, "../../shared");

const DeleteFromRow = async (
  documentId,
  fieldToUpdate,
  fileName,
  projectId
) => {
  try {
    const document = await BudgetRowsModel.findById(documentId);

    if (!document) {
      throw new Error("Document not found");
    }

    const filePath = `${uploadDir}/${projectId}/budgetRows/${documentId}/${fieldToUpdate}/${fileName}`;
    fs.unlinkSync(filePath);

    const index = document[fieldToUpdate].indexOf(fileName);
    if (index !== -1) {
      document[fieldToUpdate].splice(index, 1);
    }

    await document.save();
  } catch (error) {
    throw error;
  }
};

module.exports = DeleteFromRow;
