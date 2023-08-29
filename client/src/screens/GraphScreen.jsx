import React, { useState, useEffect } from "react";
import axios from "axios";
import apiAddress from "../globals/apiAddress";
import DialogLoader from "../components/DialogLoader";
import AlertBox from "../components/AlertBox";
import { Typography, Box } from "@mui/material";
import StatusPie from "./GraphScreen/Projects/StatusPie";
import UsersRadar from "./GraphScreen/Projects/UsersProjects";

const GraphScreen = () => {
  const [projects, setProjects] = useState();
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const getProjects = () => {
    return axios
      .get(`${apiAddress}/project`, {
        headers: {
          Authorization: "Basic " + localStorage.getItem("token"),
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => {
        setProjects(res.data);
      })
      .catch((err) => {
        setAlertMessage("Данните не могат да бъдат заредени");
      });
  };

  const getUsers = () => {
    return axios
      .get(`${apiAddress}/user`, {
        headers: {
          Authorization: "Basic " + localStorage.getItem("token"),
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        setAlertMessage("Потребителят не може да бъде зареден");
      });
  };

  useEffect(() => {
    setLoading(true);
    getProjects();
    getUsers();
    setLoading(false);
  }, []);

  return (
    <div>
      {projects && users ? (
        <Box
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <Box style={{ width: 500, height: 550 }}>
            <StatusPie
              data={projects.map((el) => {
                return {
                  project: el._id,
                  status: el.status,
                };
              })}
            />
          </Box>
          <Box style={{ width: 500, height: 550 }}>
            <UsersRadar userData={users} />
          </Box>
        </Box>
      ) : loading ? (
        <Typography
          style={{
            textAlign: "center",
            marginTop: 50,
            fontSize: 19,
          }}
        >
          Няма връзка с базата данни и не могат да бъдат визуализирани графиките
        </Typography>
      ) : (
        ""
      )}
      {loading ? <DialogLoader /> : null}
      {alertMessage ? (
        <AlertBox
          success={false}
          text={alertMessage}
          display={setAlertMessage}
        />
      ) : null}
    </div>
  );
};
export default GraphScreen;
