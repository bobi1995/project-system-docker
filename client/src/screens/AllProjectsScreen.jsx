import React, { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import DialogLoader from "../components/DialogLoader";
import AlertBox from "../components/AlertBox";
import { Typography } from "@material-ui/core";
import SingleProject from "./AllProjects/SingleProject";
import history from "../components/history";
import axios from "axios";
import apiAddress from "../globals/apiAddress";
import ProjectsTable from "../components/ProjectsTable";

const useStyles = makeStyles(() => ({
  containerStyle: {
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  nameStyle: {
    color: "#3F51B5",
    fontSize: 21,
  },
  tableContainer: {
    width: "50%",
    margin: "0 auto",
  },
}));

const AllProjectsScreen = (props) => {
  const classes = useStyles();
  const [alertMessage, setAlertMessage] = useState("");
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [tableView, setTableView] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${apiAddress}/project`, {
        headers: {
          Authorization: "Basic " + localStorage.getItem("token"),
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => {
        res.data.sort((a, b) =>
          a.status > b.status ? 1 : b.status > a.status ? -1 : 0
        );
        setData(res.data);

        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setAlertMessage("Проектите не могат да бъдат заредени");
      });
  }, []);

  return (
    <Box className={classes.container}>
      <Box style={{ textAlign: "center", marginTop: 10 }}>
        <Button
          onClick={() => setTableView(true)}
          style={
            !tableView
              ? { backgroundColor: "white", color: "#2A8B92", width: 120 }
              : { backgroundColor: "#2A8B92", color: "white", width: 120 }
          }
        >
          Табличен
        </Button>
        <Button
          onClick={() => setTableView(false)}
          style={
            tableView
              ? { backgroundColor: "white", color: "#2A8B92", width: 120 }
              : { backgroundColor: "#2A8B92", color: "white", width: 120 }
          }
        >
          Разделен
        </Button>
      </Box>
      {data ? (
        <Box className={!tableView ? classes.containerStyle : {}}>
          {data.length > 0 ? (
            tableView ? (
              <ProjectsTable data={data} />
            ) : (
              data.map((el) => <SingleProject data={el} key={el._id} />)
            )
          ) : (
            <Typography>Няма налични проекти</Typography>
          )}
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
    </Box>
  );
};

export default AllProjectsScreen;
