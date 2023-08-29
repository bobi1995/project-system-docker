import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Typography, Paper, Box } from "@mui/material";
ChartJS.register(ArcElement, Tooltip, Legend);

export const dataTest = {
  labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

const StatusPie = ({ data }) => {
  let open = 0;
  let withContract = 0;
  let closed = 0;
  data.map((el) =>
    el.status === 0
      ? open++
      : el.status === 1
      ? withContract++
      : el.status === 2
      ? closed++
      : ""
  );
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
        Статус на всички проекти
      </Typography>
      <Box style={{ padding: 15 }}>
        <Pie
          data={{
            labels: ["Без Договор", "Подписан Договор", "Завършени"],
            datasets: [
              {
                label: "# of Votes",
                data: [open, withContract, closed],
                backgroundColor: [
                  "rgba(255,25,25, 0.2)",
                  "rgba(246,232,49, 0.2)",
                  "rgba(53,182,126, 0.2)",
                ],
                borderColor: [
                  "rgba(255,25,25, 1)",
                  "rgba(246,232,49, 1)",
                  "rgba(53,182,126, 1)",
                ],
                borderWidth: 1,
              },
            ],
          }}
        />
      </Box>
    </Paper>
  );
};
export default StatusPie;
