const express = require("express");
const ProjectModel = require("../mongoModels/project");
const UserModel = require("../mongoModels/user");
const BudgetRowsModel = require("../mongoModels/rowsOfBudget");
const router = express.Router();
const fs = require("fs");
const localAddress = require("../globals/localAddess");
const deleteFromRow = require("./multers/deleteFromRow");

//MULTERS
const uploadOffer = require("./multers/rowsOfBudget/offer");
const uploadInvoice = require("./multers/rowsOfBudget/invoice");

//upload invoice
router.post(
  "/invoice",
  uploadInvoice.array("invoice", 10),
  async (req, res, next) => {
    const file = req.files;
    const rowOfBudget = await BudgetRowsModel.findById(req.body.rowId);
    if (!rowOfBudget) {
      return res.status(201).send("Row not found");
    }
    if (!file || file.length < 1) {
      return res.status(201).send("Please upload a file");
    }
    file.map((el) => {
      rowOfBudget.invoice.push(el.originalname);
    });
    await rowOfBudget.save();

    return res.status(200).send("Uploaded");
  }
);

//delete invoice
router.delete("/invoice", async (req, res) => {
  try {
    await deleteFromRow(
      req.body.rowId,
      "invoice",
      req.body.fileName,
      req.body.projectId
    );
    return res.status(200).send("Deleted");
  } catch (error) {
    console.log(error);
    return res.status(500).send("An error occurred while deleting the file.");
  }
});

//upload offer
router.post(
  "/offer",
  uploadOffer.array("offer", 10),
  async (req, res, next) => {
    const file = req.files;
    const rowOfBudget = await BudgetRowsModel.findById(req.body.rowId);
    if (!rowOfBudget) {
      return res.status(201).send("Row not found");
    }
    if (!file || file.length < 1) {
      return res.status(201).send("Please upload a file");
    }

    file.map((el) => {
      rowOfBudget.offer.push(el.originalname);
    });
    await rowOfBudget.save();
    return res.status(200).send("Uploaded");
  }
);

//delete offer
router.delete("/offer", async (req, res) => {
  try {
    await deleteFromRow(
      req.body.rowId,
      "offer",
      req.body.fileName,
      req.body.projectId
    );
    return res.status(200).send("Deleted");
  } catch (error) {
    console.log(error);
    return res.status(500).send("An error occurred while deleting the file.");
  }
});

//add row
router.post("/", async (req, res) => {
  if (!req.isAuth) {
    return res.status(401).send("Нямаш права за тази сесия");
  }
  const project = await ProjectModel.findById(req.body.projectId);

  if (!project) {
    return res.status(400).send("Project could not be found");
  }

  const budgetRow = new BudgetRowsModel({
    position: req.body.position,
    size: req.body.size,
    quantity: req.body.quantity ? req.body.quantity : 1,
    singlePrice: req.body.singlePrice ? req.body.singlePrice : 0,
    totalPrice: req.body.singlePrice * req.body.quantity,
    provider: req.body.provider,
    agreedPrice: req.body.agreedPrice ? req.body.agreedPrice : 0,
    project: req.body.projectId,
  });
  if (project.type === "3" && project.totalProfit) {
    project.totalProfit =
      project.totalProfit - budgetRow.agreedPrice * budgetRow.quantity;
    await project.save();
  }
  return budgetRow
    .save()
    .then(() => {
      return ProjectModel.findById(req.body.projectId);
    })
    .then((foundProject) => {
      if (!foundProject) {
        res.send("Project could not be found");
      }
      foundProject.budget.push(budgetRow);
      foundProject.save();
    })
    .then(() => res.status(200).send("Updated"))
    .catch((err) => {
      return res.status(401).send(err);
    });
});

//edit row
router.put("/", async (req, res) => {
  if (!req.isAuth) {
    return res.status(401).send("Нямаш права за тази сесия");
  }
  const budgetRow = await BudgetRowsModel.findById(req.body.budgetRowId);
  if (!budgetRow) {
    return res.status(401).send("Budget row could not be found");
  }
  const project = await ProjectModel.findById(budgetRow.project);
  if (!project) {
    return res.status(401).send("Project could not be found");
  }

  let newInvoice;

  if (req.body.invoice) {
    newInvoice = budgetRow.invoice.concat(req.body.invoice);
  }

  try {
    await BudgetRowsModel.findOneAndUpdate(
      {
        _id: budgetRow._id,
      },
      {
        $set: {
          position: req.body.position,
          size: req.body.size,
          quantity: req.body.quantity ? req.body.quantity : 1,
          singlePrice: req.body.singlePrice ? req.body.singlePrice : 0,
          provider: req.body.provider,
          agreedPrice: req.body.agreedPrice ? req.body.agreedPrice : 0,
        },
      }
    );

    const allRows = await BudgetRowsModel.find({
      project: project._id,
    });

    if (allRows.length > 0 && project.totalProfit) {
      let totalBudget = 0;
      allRows.map(
        (el) => (totalBudget = totalBudget + el.agreedPrice * el.quantity)
      );

      project.totalProfit = parseInt(project.contractSum - totalBudget);
      await project.save();
    }

    return res.status(200).send("Updated");
  } catch (error) {
    return res.status(400).send(error);
  }
});

//delete individual row
router.delete("/", async (req, res) => {
  if (!req.isAuth) {
    return res.status(401).send("Нямаш права за тази сесия");
  }
  const budgetRow = await BudgetRowsModel.findById(req.body.budgetRowId);
  if (!budgetRow) {
    return res.status(400).send("Row could not be found");
  }

  const project = await ProjectModel.findById(req.body.projectId);
  if (!project) {
    return res.status(400).send("Project could not be found");
  }

  await ProjectModel.updateOne(
    { _id: project._id },
    { $pull: { budget: { $in: req.body.budgetRowId } } }
  );

  await BudgetRowsModel.deleteOne({
    _id: req.body.budgetRowId,
  });

  const allRows = await BudgetRowsModel.find({
    project: req.body.projectId,
  });

  if (allRows.length > 0 && project.totalProfit) {
    let totalBudget = 0;

    allRows.map((el) => {
      const agreedPrice = el.agreedPrice ? el.agreedPrice : 0;
      const quantity = el.quantity ? el.quantity : 0;
      return (totalBudget = totalBudget + agreedPrice * quantity);
    });

    project.totalProfit = project.contractSum - totalBudget;
    await project.save();
  }

  const filePath = `${localAddress}\\${req.body.projectId}\\budgetRows\\${req.body.budgetRowId}`;

  fs.rmSync(filePath, { recursive: true, force: true });

  return res.status(200).send("Deleted");
});

module.exports = router;
