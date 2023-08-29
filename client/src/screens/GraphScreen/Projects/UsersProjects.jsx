import React from "react";
import { Typography, Paper, Box } from "@mui/material";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export const data = {
  labels: ["Thing 1", "Thing 2", "Thing 3", "Thing 4", "Thing 5", "Thing 6"],
  datasets: [
    {
      label: "# of Votes",
      data: [2, 9, 3, 5, 2, 3],
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
    },
  ],
};

const UsersRadar = ({ userData }) => {
  return (
    <Paper
      elevation={11}
      style={{
        marginTop: 30,
        width: "100%",
        height: "100%",
      }}
    >
      <Typography
        style={{
          textAlign: "center",
          fontSize: 19,
          color: "#35AEB6",
          fontWeight: "bold",
        }}
      >
        Проекти по служители
      </Typography>
      <Box>
        <Radar
          data={{
            labels: userData.map((el) => el.name),
            datasets: [
              {
                label: "Брой Проекти",
                data: userData.map((el) =>
                  el.projects ? el.projects.length : 0
                ),
                backgroundColor: "rgba(53,174,182, 0.2)",
                borderColor: "rgba(53,174,182, 1)",
                borderWidth: 1,
              },
            ],
          }}
        />
      </Box>
    </Paper>
  );
};

export default UsersRadar;
