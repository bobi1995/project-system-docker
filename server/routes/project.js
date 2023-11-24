const express = require("express");
const ProjectModel = require("../mongoModels/project");
const UserModel = require("../mongoModels/user");
const BudgetRowsModel = require("../mongoModels/rowsOfBudget");
const ResultModel = require("../mongoModels/result");
const router = express.Router();
const fs = require("fs");
const moment = require("moment");
const deleteFileAndRemoveFromProject = require("./multers/deleteFunction");
const path = require("path");
const uploadDir = path.join(__dirname, "../shared");

//MULTER DECLARATIONS OFFER
const uploadOffer = require("./multers/project/offer");
const uploadSchedule = require("./multers/project/schedule");
const uploadSimulation = require("./multers/project/simulation");
const uploadContract = require("./multers/project/contract");
const uploadSubcontractor = require("./multers/project/subcontractor");
const uploadPictures = require("./multers/project/pictures");
const uploadStandpoint = require("./multers/project/standpoint");
const uploadPermission = require("./multers/project/permission");
const uploadProjectDocs = require("./multers/project/projectDocs");

//upload standpoint
router.post(
  "/standpoint",
  uploadStandpoint.single("standpoint"),
  async (req, res, next) => {
    const file = req.file;
    const project = await ProjectModel.findById(req.body.projectId);
    if (!project) {
      return res.send("Project not found");
    }
    if (!file) {
      return res.send("Please upload a file");
    }
    project.standpoint.push(file.originalname);
    await project.save();
    return res.send(file.originalname);
  }
);

//delete standpoint
router.delete("/standpoint", async (req, res) => {
  try {
    await deleteFileAndRemoveFromProject(
      req.body.projectId,
      req.body.fileName,
      "standpoint"
    );

    const project = await ProjectModel.findById(req.body.projectId);
    if (!project) {
      return res.status(404).send("Project not found");
    }

    await project.save();
    res.status(200).send("Deleted");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while deleting the file.");
  }
});

//upload permission
router.post(
  "/permission",
  uploadPermission.single("permission"),
  async (req, res, next) => {
    const file = req.file;
    const project = await ProjectModel.findById(req.body.projectId);
    if (!project) {
      return res.status(200).send("Project not found");
    }
    if (!file) {
      return res.status(200).send("Please upload a file");
    }
    project.permission.push(file.originalname);
    await project.save();
    return res.send(file.originalname);
  }
);

//delete permission
router.delete("/permission", async (req, res) => {
  try {
    await deleteFileAndRemoveFromProject(
      req.body.projectId,
      req.body.fileName,
      "permission"
    );

    const project = await ProjectModel.findById(req.body.projectId);
    if (!project) {
      return res.status(404).send("Project not found");
    }

    await project.save();
    res.status(200).send("Deleted");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while deleting the file.");
  }
});

//upload projectDocs
router.post(
  "/projectDocs",
  uploadProjectDocs.single("projectDocs"),
  async (req, res, next) => {
    const file = req.file;
    const project = await ProjectModel.findById(req.body.projectId);
    if (!project) {
      return res.send("Project not found");
    }
    if (!file) {
      return res.send("Please upload a file");
    }
    project.projectDocs.push(file.originalname);
    await project.save();
    return res.send(file.originalname);
  }
);

//delete projectDocs
router.delete("/projectDocs", async (req, res) => {
  try {
    await deleteFileAndRemoveFromProject(
      req.body.projectId,
      req.body.fileName,
      "projectDocs"
    );

    const project = await ProjectModel.findById(req.body.projectId);
    if (!project) {
      return res.status(404).send("Project not found");
    }

    await project.save();
    res.status(200).send("Deleted");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while deleting the file.");
  }
});

//upload offer
router.post("/offer", uploadOffer.single("offer"), async (req, res, next) => {
  const file = req.file;
  const project = await ProjectModel.findById(req.body.projectId);
  if (!project) {
    return res.send("Project not found");
  }
  if (!file) {
    return res.send("Please upload a file");
  }
  project.offer.push(file.originalname);
  await project.save();
  return res.send(file.originalname);
});

//delete offer
router.delete("/offer", async (req, res) => {
  try {
    await deleteFileAndRemoveFromProject(
      req.body.projectId,
      req.body.fileName,
      "offer"
    );

    const project = await ProjectModel.findById(req.body.projectId);
    if (!project) {
      return res.status(404).send("Project not found");
    }

    await project.save();
    res.status(200).send("Deleted");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while deleting the file.");
  }
});

//upload schedule
router.post(
  "/schedule",
  uploadSchedule.single("schedule"),
  async (req, res, next) => {
    const file = req.file;
    const project = await ProjectModel.findById(req.body.projectId);
    if (!project) {
      return res.send("Project not found");
    }
    if (!file) {
      return res.send("Please upload a file");
    }
    project.schedule.push(file.originalname);
    await project.save();
    return res.send(file.originalname);
  }
);

//delete schedule
router.delete("/schedule", async (req, res) => {
  try {
    await deleteFileAndRemoveFromProject(
      req.body.projectId,
      req.body.fileName,
      "schedule"
    );

    const project = await ProjectModel.findById(req.body.projectId);
    if (!project) {
      return res.status(404).send("Project not found");
    }

    await project.save();
    res.status(200).send("Deleted");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while deleting the file.");
  }
});

//upload simulation
router.post(
  "/simulation",
  uploadSimulation.single("simulation"),
  async (req, res, next) => {
    console.log("here");

    const file = req.file;
    const project = await ProjectModel.findById(req.body.projectId);
    if (!project) {
      return res.send("Project not found");
    }
    if (!file) {
      return res.send("Please upload a file");
    }
    project.simulation.push(file.originalname);
    await project.save();
    return res.send(file.originalname);
  }
);

//delete simulation
router.delete("/simulation", async (req, res) => {
  try {
    await deleteFileAndRemoveFromProject(
      req.body.projectId,
      req.body.fileName,
      "simulation"
    );
    res.status(200).send("Deleted");
  } catch (error) {
    console.error(error);

    res.status(500).send("An error occurred while deleting the file.");
  }
});

//upload contract
router.post(
  "/contract",
  uploadContract.single("contract"),
  async (req, res, next) => {
    const file = req.file;
    const project = await ProjectModel.findById(req.body.projectId);
    if (!project) {
      return res.send("Project not found");
    }
    if (!file) {
      return res.send("Please upload a file");
    }
    project.contract.push(file.originalname);
    project.status = 1;
    await project.save();
    return res.send(file.originalname);
  }
);

//delete contract
router.delete("/contract", async (req, res) => {
  try {
    await deleteFileAndRemoveFromProject(
      req.body.projectId,
      req.body.fileName,
      "contract"
    );
    const project = await ProjectModel.findById(req.body.projectId);
    if (!project) {
      return res.status(404).send("Project not found");
    }

    if (project.contract.length < 1) {
      project.status = 0;
    }
    await project.save();
    res.status(200).send("Deleted");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while deleting the file.");
  }
});

//upload subcontractor
router.post(
  "/subcontractor",
  uploadSubcontractor.single("subcontractor"),
  async (req, res, next) => {
    const file = req.file;
    const project = await ProjectModel.findById(req.body.projectId);
    if (!project) {
      return res.send("Project not found");
    }
    if (!file) {
      return res.send("Please upload a file");
    }
    project.subcontractor.push(file.originalname);
    await project.save();
    return res.send(file.originalname);
  }
);

//delete subcontractor
router.delete("/subcontractor", async (req, res) => {
  try {
    await deleteFileAndRemoveFromProject(
      req.body.projectId,
      req.body.fileName,
      "subcontractor"
    );

    const project = await ProjectModel.findById(req.body.projectId);
    if (!project) {
      return res.status(404).send("Project not found");
    }

    await project.save();
    res.status(200).send("Deleted");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while deleting the file.");
  }
});

//upload pictures
router.post(
  "/pictures",
  uploadPictures.array("pictures", 12),
  async (req, res, next) => {
    const file = req.files;
    const project = await ProjectModel.findById(req.body.projectId);
    if (!project) {
      return res.status(201).send("Project not found");
    }
    if (!file || file.length < 1) {
      return res.status(201).send("Please upload a file");
    }
    file.map((el) => project.pictures.push(el.originalname));
    await project.save();
    return res.status(200).send("Uploaded");
  }
);

//delete pictures
router.delete("/pictures", async (req, res) => {
  try {
    await deleteFileAndRemoveFromProject(
      req.body.projectId,
      req.body.fileName,
      "pictures"
    );

    const project = await ProjectModel.findById(req.body.projectId);
    if (!project) {
      return res.status(404).send("Project not found");
    }

    await project.save();
    res.status(200).send("Deleted");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while deleting the file.");
  }
});

//get all projects
router.get("/", async (req, res) => {
  if (!req.isAuth) {
    return res.status(401).send("Нямаш права за тази сесия");
  }
  const projects = await ProjectModel.find()
    .populate("owner")
    .populate("budget");
  if (!projects) {
    return res.status(201).send("Project does not exist");
  }
  return res.status(200).send(projects);
});

//get individual project
router.get("/:projectId", async (req, res) => {
  if (!req.isAuth) {
    return res.status(401).send("Нямаш права за тази сесия");
  }
  const project = await ProjectModel.findById(req.params.projectId)
    .populate("budget")
    .populate("owner");
  if (!project) {
    return res.send("Project does not exist");
  }
  res.status(200);
  return res.send(project);
});

//add individual project
router.post("/", async (req, res) => {
  const user = await UserModel.findById(req.body.ownerId);
  if (!user) {
    return res.send("Owner could not be found");
  }

  const project = new ProjectModel({
    name: req.body.name,
    power: req.body.power,
    location: req.body.location,
    status: 0,
    type: req.body.type,
    startDate: req.body.startDate ? req.body.startDate : new Date(),
    targetDate: req.body.targetDate ? req.body.targetDate : new Date(),
    owner: req.body.ownerId,
    offer: [],
    schedule: [],
    simulation: [],
    contract: [],
    subcontractor: [],
  });
  let createdProject;
  return project
    .save()
    .then((result) => {
      createdProject = result;
      fs.mkdirSync(`${uploadDir}/${createdProject._id}`);

      return UserModel.findById(req.body.ownerId);
    })
    .then((foundUser) => {
      if (!foundUser) {
        return res.send("Owner could not be found");
      }
      foundUser.projects.push(project);
      return foundUser.save();
    })
    .then(() => {
      return res.send(createdProject._id);
    })
    .catch((err) => {
      return res.send(err);
    });
});

//transfer project
router.put("/transfer", async (req, res) => {
  if (!req.isAuth) {
    return res.status(401).send("Нямаш права за тази сесия");
  }
  const project = await ProjectModel.findById(req.body.projectId);
  if (!project) {
    return res.status(201).send("Project could not be found");
  }
  if (project.status === 2) {
    return res
      .status(201)
      .send("Project is closed and cannot be edited anymore");
  }
  const oldUser = await UserModel.findById(project.owner);
  if (!oldUser) {
    return res.send("Current onwer could not be found");
  }

  const user = await UserModel.findById(req.body.newOwner);
  if (!user) {
    return res.send("User could not be found");
  }

  await ProjectModel.findOneAndUpdate(
    {
      _id: project._id,
    },
    {
      $set: {
        owner: user._id,
      },
    }
  )
    .then((respond) =>
      UserModel.updateOne(
        { _id: oldUser._id },
        { $pull: { projects: { $in: req.body.projectId } } }
      )
    )
    .then((res) => {
      user.projects.push(project);
      return user.save();
    })
    .then((result) => res.status(200).send("Updated"))
    .catch((err) => res.status(201).send(err));
});

//edit project
router.put("/", async (req, res) => {
  if (!req.isAuth) {
    return res.status(401).send("Нямаш права за тази сесия");
  }
  const project = await ProjectModel.findById(req.body.projectId);
  if (!project) {
    return res.status(201).send("Project could not be found");
  }
  if (project.status === 2) {
    return res
      .status(201)
      .send("Project is closed and cannot be edited anymore");
  }

  const updatedProject = await ProjectModel.findOneAndUpdate(
    {
      _id: project._id,
    },
    {
      $set: {
        power: req.body.power,
        targetDate: req.body.targetDate,
        totalProfit:
          req.body.totalProfit || project.totalProfit
            ? req.body.totalProfit
            : 0,
        contractSum:
          req.body.contractSum || project.contractSum
            ? req.body.contractSum
            : 0,
        type: req.body.type,
        name: req.body.name,
        location: req.body.location,
        payments: req.body.payments,
      },
    }
  )
    .then((respond) => res.status(200).send("Updated"))
    .catch((err) => res.status(201).send(err));
});

//delete individual project
router.delete("/", async (req, res) => {
  if (!req.isAuth) {
    return res.status(401).send("Нямаш права за тази сесия");
  }

  try {
    const project = await ProjectModel.findById(req.body.projectId);
    if (!project) {
      return res.status(201).send("Project could not be found");
    }

    const owner = await UserModel.findById(project.owner);
    if (!owner) {
      return res.status(201).send("Owner could not be found");
    }

    const result = await ResultModel.findOneAndDelete({ project: project._id });

    if (result) {
      await UserModel.updateOne(
        { _id: owner._id },
        { $pull: { results: result._id } }
      );
    }

    await UserModel.updateOne(
      { _id: owner._id },
      { $pull: { projects: project._id } }
    );

    if (project.budget.length > 0) {
      await Promise.all(
        project.budget.map(async (el) => {
          await BudgetRowsModel.deleteOne({ _id: el });
        })
      );
    }

    await ProjectModel.deleteOne({ _id: req.body.projectId });

    const filePath = `${uploadDir}/${req.body.projectId}/`;
    fs.rmSync(filePath, { recursive: true, force: true });

    return res.status(200).send("Deleted");
  } catch (error) {
    return res
      .status(500)
      .send("An error occurred while deleting the project.");
  }
});

//close project
router.post("/close", async (req, res) => {
  const project = await ProjectModel.findById(req.body.projectId);
  if (!project) {
    return res.status(201).send("Project could not be found");
  }
  if (project.status === 2) {
    return res.status(201).send("Project already closed");
  }
  const user = await UserModel.findById(project.owner);
  if (!user) {
    return res.status(201).send("User not found");
  }
  try {
    const updatedProject = await ProjectModel.findOneAndUpdate(
      {
        _id: project._id,
      },
      {
        $set: {
          status: 2,
          endDate: new Date(),
          totalProfit: req.body.win,
        },
      }
    );

    const days = moment
      .duration(Math.abs(new Date() - new Date(project.startDate)))
      .asDays();

    const month = Math.round(days / 30);

    const now = new Date();
    const nextMonthFirstDay = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );
    const startMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    nextMonthFirstDay.setMonth(nextMonthFirstDay.getMonth() + month);

    const result = new ResultModel({
      totalProfit: project.totalProfit,
      period: days,
      project: project._id,
      endDate: nextMonthFirstDay,
      startDate: startMonth,
      name: project.name,
    });
    await result.save();
    user.results.push(result);

    await user.save();
    return res.status(200).send("Closed");
  } catch (error) {
    return res.status(201).send("Unsuccessfull closing");
  }
});

//add payment to project
router.post("/payment", async (req, res) => {
  if (!req.isAuth) {
    return res.status(401).send("Нямаш права за тази сесия");
  }
  const project = await ProjectModel.findById(req.body.projectId);
  if (!project) {
    return res.status(201).send("Project could not be found");
  }
  if (project.status === 2) {
    return res
      .status(201)
      .send("Project is closed and cannot be edited anymore");
  }
  project.payments.push(req.body.payment);

  await project
    .save()
    .then((respond) => res.status(200).send("Updated"))
    .catch((err) => res.status(201).send(err));
});

module.exports = router;
