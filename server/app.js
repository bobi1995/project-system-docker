const express = require("express");
const mongoose = require("mongoose");
const isAuth = require("./middlewares/isAuth");
const cors = require("cors");
const dotenv = require("dotenv").config();

//IMPORT ROUTES
const userRoute = require("./routes/users");
const loginRoute = require("./routes/login");
const projectRoute = require("./routes/project");
const budgetRowRoute = require("./routes/budgetRow");
const userCostRoute = require("./routes/userCost");

const url = `${process.env.MONGODB_URI}/${process.env.DB_NAME}`;
const app = express();
const keyword = "api";

//middlewares
app.use(express.json());
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(isAuth);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  return next();
});

app.use(`/${keyword}/user`, userRoute);
app.use(`/${keyword}/login`, loginRoute);
app.use(`/${keyword}/project`, projectRoute);
app.use(`/${keyword}/budget`, budgetRowRoute);
app.use(`/${keyword}/cost`, userCostRoute);
//routes
app.get("/api/", (req, res) => {
  res.send("Working");
});

//starting
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    require("./mongoModels/user");
    require("./mongoModels/project");
    require("./mongoModels/result");
    require("./mongoModels/rowsOfBudget");
    require("./mongoModels/userCost");
  })
  .then(() =>
    app.listen(process.env.PORT, () =>
      console.log("listening on " + process.env.PORT)
    )
  )
  .catch((err) => console.log(err));
