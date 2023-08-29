import React, { useState } from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import apiAddress from "../../globals/apiAddress";
import AddRow from "./Budget/AddRow";
import BudgetTable from "./Budget/BudgetTable";
export default function Budget(props) {
  return (
    <Paper>
      <Typography
        sx={{ mt: 4, mb: 2 }}
        variant="h6"
        component="div"
        style={{ marginBottom: 50 }}
      >
        Бюджет и позиции
      </Typography>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <BudgetTable
          setLoading={props.setLoading}
          contract={props.contract}
          data={props.data}
          projectId={props.projectId}
          status={props.status}
          ownerId={props.ownerId}
          payments={props.payments}
        />
      </Box>
      <AddRow
        projectId={props.projectId}
        status={props.status}
        ownerId={props.ownerId}
      />
    </Paper>
  );
}
