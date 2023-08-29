import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import apiAddress from "../globals/apiAddress";
import axios from "axios";
import DialogLoader from "../components/DialogLoader";
import AlertBox from "../components/AlertBox";
import MaterialTable from "material-table";
import {
  ArrowUpward,
  FirstPage,
  LastPage,
  ChevronLeft,
  ChevronRight,
  GetApp,
} from "@material-ui/icons";
import history from "../components/history";
import SearchIcon from "@material-ui/icons/Search";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import AddIcon from "@material-ui/icons/Add";
import Salary from "./IndividualUser/Salary";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import numeral from "numeral";
import moment from "moment";
import EditUser from "./IndividualUser/EditUser";
import ProjectsTable from "../components/ProjectsTable";

const useStyles = makeStyles({
  container: {
    marginTop: "3rem",
  },
  textStyle: {
    fontSize: 19,
    fontFamily: "Sansa",
  },
});
const IndividualUserScreen = (props) => {
  const classes = useStyles();
  const [alertMessage, setAlertMessage] = useState("");
  const [data, setData] = useState();
  const [loading, setLoading] = useState();
  const [openCost, setOpenCost] = useState(false);
  const [costName, setCostName] = useState("");
  const [costValue, setCostValue] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [totalResult, setTotalResult] = useState(0);
  const [results, setResults] = useState([]);

  const closeCost = () => {
    setOpenCost(false);
  };

  const onChangeCostName = (e) => {
    setCostName(e.target.value);
  };

  const onChangeCostValue = (e) => {
    setCostValue(e.target.value);
  };

  const saveCost = () => {
    if (!data.userCost) {
      return setAlertMessage(
        "Първо трябва да въведеш основна заплата преди допълнителните разходи"
      );
    }
    axios({
      method: "put",
      url: `${apiAddress}/cost`,
      headers: {
        Authorization: "Basic " + localStorage.getItem("token"),
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      data: {
        otherCost: `${costName} - ${costValue}`,
        userId: data._id,
        userCostId: data.userCost._id,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          window.location.reload();
        } else setAlertMessage(res.data);
      })
      .catch((e) => {
        setLoading(false);
        setAlertMessage(e);
      });
  };

  const deleteCost = (costData) => {
    axios({
      method: "delete",
      url: `${apiAddress}/cost`,
      headers: {
        Authorization: "Basic " + localStorage.getItem("token"),
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      data: {
        userCostId: data.userCost._id,
        costData,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          window.location.reload();
        } else setAlertMessage(res.data);
      })
      .catch((e) => {
        setLoading(false);
        setAlertMessage(e);
      });
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${apiAddress}/user/${props.match.params.userId}`, {
        headers: {
          Authorization: "Basic " + localStorage.getItem("token"),
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => {
        setData(res.data);
        if (res.data && res.data.results) {
          const current = res.data.results.filter(
            (el) =>
              new Date(el.endDate) > new Date() &&
              el.period > 0.5 &&
              new Date(el.startDate) <= new Date()
          );
          setResults(current);
        }
        //calculating total cost
        if (res.data && res.data.userCost && res.data.userCost.others) {
          let temp = 0;
          res.data.userCost.others.map((el) => {
            const parts = el.split(" - ");
            temp = temp + parseFloat(parts[1]);
          });
          setTotalCost(temp + res.data.userCost.salary);
        }

        //calculating total profit
        if (res.data && res.data.results) {
          let temp = 0;
          res.data.results.map((el) => {
            if (
              Math.round(el.period / 30) > 0 &&
              new Date(el.endDate) > new Date() &&
              new Date(el.startDate) <= new Date()
            ) {
              temp = temp + el.totalProfit / Math.round(el.period / 30);
            }
          });
          setTotalResult(temp);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setAlertMessage("Потребителят не може да бъде зареден");
      });
  }, []);

  return (
    <Box className={classes.container}>
      {data ? (
        <Box>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-around",
              flexWrap: "wrap",
            }}
          >
            <Box style={{ width: "25%" }}>
              <Box style={{ marginTop: 10, textAlign: "center" }}>
                <TextField
                  label="Име"
                  className={classes.inputBox}
                  value={data.name}
                  disabled
                />
              </Box>
              <Box style={{ marginTop: 10, textAlign: "center" }}>
                <TextField
                  label="Имейл"
                  type="email"
                  className={classes.inputBox}
                  value={data.email}
                  disabled
                />
              </Box>
              <Box style={{ marginTop: 10, textAlign: "center" }}>
                <TextField
                  label="Тип"
                  className={classes.inputBox}
                  value={
                    data.isAdmin ? "Администратор" : "Обикновен потребител"
                  }
                  disabled
                />
              </Box>

              <Box style={{ marginTop: 10, textAlign: "center" }}>
                <EditUser userId={props.match.params.userId} data={data} />
              </Box>
              <Box style={{ marginTop: 50, textAlign: "center" }}>
                <TextField
                  label="Заплата"
                  className={classes.inputBox}
                  value={
                    data.userCost
                      ? `${data.userCost.salary} лв.`
                      : "Няма въведена"
                  }
                  disabled
                />
              </Box>
              <Box style={{ marginTop: 10, textAlign: "center" }}>
                <Salary
                  userId={data._id}
                  costId={data.userCost ? data.userCost._id : null}
                />
              </Box>
            </Box>
            <Box style={{ width: "30%" }}>
              <MaterialTable
                style={{ width: "100%" }}
                title="Допълнителни разходи"
                icons={{
                  Filter: React.forwardRef((props, ref) => (
                    <SearchIcon ref={ref} />
                  )),
                  Search: React.forwardRef((props, ref) => (
                    <SearchIcon ref={ref} />
                  )),
                  ResetSearch: React.forwardRef((props, ref) => (
                    <RotateLeftIcon ref={ref} />
                  )),
                  SortArrow: ArrowUpward,
                  FirstPage: FirstPage,
                  LastPage: LastPage,
                  NextPage: ChevronRight,
                  PreviousPage: ChevronLeft,
                  Export: GetApp,
                }}
                columns={[
                  {
                    title: "Разход",
                    field: "salary",
                    render: (rowData) => {
                      return rowData.el.split(" - ")[0];
                    },
                    cellStyle: {
                      width: "70%",
                    },
                  },
                  {
                    title: "Стойност",
                    field: "power",
                    render: (rowData) =>
                      `${numeral(rowData.el.split(" - ")[1]).format(
                        "0,0"
                      )} лв.`,
                    cellStyle: {
                      width: "25%",
                    },
                  },
                  {
                    title: "Изтрий",
                    field: "delete",
                    render: (rowData) => (
                      <Button onClick={() => deleteCost(`${rowData.el}`)}>
                        <DeleteForeverIcon style={{ color: "red" }} />
                      </Button>
                    ),
                    cellStyle: {
                      textAlign: "center",
                    },
                  },
                ]}
                data={
                  data.userCost
                    ? data.userCost.others.map((el) => ({ el }))
                    : []
                }
                options={{
                  sorting: false,
                  search: false,
                }}
                actions={[
                  {
                    icon: () => <AddIcon />,
                    tooltip: "Добави разход",
                    isFreeAction: true,
                    onClick: (event) => setOpenCost(true),
                  },
                ]}
              />
            </Box>
            <Box style={{ width: "30%" }}>
              <MaterialTable
                style={{ width: "100%" }}
                title="Рeзултати"
                icons={{
                  Filter: React.forwardRef((props, ref) => (
                    <SearchIcon ref={ref} />
                  )),
                  Search: React.forwardRef((props, ref) => (
                    <SearchIcon ref={ref} />
                  )),
                  ResetSearch: React.forwardRef((props, ref) => (
                    <RotateLeftIcon ref={ref} />
                  )),
                  SortArrow: ArrowUpward,
                  FirstPage: FirstPage,
                  LastPage: LastPage,
                  NextPage: ChevronRight,
                  PreviousPage: ChevronLeft,
                  Export: GetApp,
                }}
                columns={[
                  {
                    title: "Печалба",
                    field: "totalProfit",
                    render: (rowData) => {
                      return `${numeral(rowData.el.totalProfit).format(
                        "0,0"
                      )} лв.`;
                    },
                  },
                  {
                    title: "Срок на покритие",
                    field: "endDate",
                    render: (rowData) =>
                      moment(new Date(rowData.el.endDate)).format(
                        "DD-MMM-yyyy"
                      ),
                  },
                ]}
                data={results ? results.map((el) => ({ el })) : []}
                options={{
                  sorting: false,
                  search: false,
                }}
              />
            </Box>
          </Box>
          <Box
            style={{
              justifyContent: "center",
              display: "flex",
              marginTop: 30,
            }}
          >
            <TextField
              style={{ marginRight: 5 }}
              label="Месечен разход"
              value={
                totalCost ? `${numeral(totalCost).format("0,0.00")} лв.` : ""
              }
              disabled
            />
            <TextField
              prefix="лв."
              style={{ marginLeft: 5 }}
              label="Месечен приход"
              value={`${numeral(totalResult).format("0,0.00")} лв.`}
              disabled
            />
          </Box>

          <Box>
            <ProjectsTable
              data={data.projects.filter((el) => el.status !== 2)}
            />

            <ProjectsTable
              data={data.projects.filter((el) => el.status === 2)}
            />
          </Box>
        </Box>
      ) : null}
      {loading ? <DialogLoader /> : null}
      {alertMessage ? (
        <AlertBox
          success={false}
          text={alertMessage}
          display={setAlertMessage}
        />
      ) : null}
      <Dialog
        open={openCost}
        onClose={closeCost}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-title" style={{ textAlign: "center" }}>
          Добави разход
        </DialogTitle>
        <DialogContent
          style={{ display: "flex", justifyContent: "space-around" }}
        >
          <Box>
            <Box style={{ marginTop: 10 }}>
              <TextField
                id="outlined-name"
                label="Разход"
                className={classes.inputBox}
                onChange={onChangeCostName}
                value={costName}
                required
              />
            </Box>
            <Box style={{ marginTop: 10 }}>
              <TextField
                id="outlined-name"
                label="Стойност"
                className={classes.inputBox}
                onChange={onChangeCostValue}
                value={costValue}
                required
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCost}>Откажи</Button>
          <Button
            onClick={saveCost}
            autoFocus
            disabled={!costValue || !costName}
          >
            Запази
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IndividualUserScreen;
