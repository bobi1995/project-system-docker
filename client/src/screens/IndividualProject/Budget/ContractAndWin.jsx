import React, { useState, useEffect } from "react";
import {
  Box,
  InputAdornment,
  TextField,
  Paper,
  Button,
  Tooltip,
} from "@mui/material";
import numeral from "numeral";
import apiAddress from "../../../globals/apiAddress";
import axios from "axios";
import EditIcon from "@material-ui/icons/Edit";
import NumberFormat from "react-number-format";
import Payments from "./Payments";

function NumberFormatCustom(props) {
  const { onChange, label, ...other } = props;
  return (
    <NumberFormat
      {...other}
      thousandSeparator
      isNumericString
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
    />
  );
}
const ContractAndWin = ({
  projectId,
  status,
  contract,
  totalSingle,
  totalAgreed,
  ownerId,
  setLoading,
  payments,
}) => {
  const [contractSum, setContractSum] = useState(contract);
  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (event) => {
    setContractSum(parseInt(event.target.value));
  };

  const editProfit = () => {
    setLoading(true);
    axios({
      method: "put",
      url: `${apiAddress}/project`,
      data: {
        projectId: projectId,
        contractSum,
      },
      headers: {
        Authorization: "Basic " + localStorage.getItem("token"),
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
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

  return (
    <Paper
      elevation={10}
      style={{
        width: "50%",
        minWidth: 350,
        margin: "0 auto",
        padding: 20,
      }}
    >
      <Box
        style={{
          justifyContent: "space-around",
          display: "flex",
        }}
      >
        <TextField
          label={"Сума по договор"}
          value={contractSum ? contractSum : ""}
          disabled={status === 2 ? true : false}
          onChange={handleChange}
          InputProps={{
            endAdornment: <InputAdornment position="start">лв.</InputAdornment>,
            inputComponent: NumberFormatCustom,
          }}
          InputLabelProps={{ shrink: true }}
          style={{
            minWidth: 150,
          }}
        />
        <Tooltip
          title="Печалба = (Сума по договор) - (Обща Покупна)"
          arrow
          placement="top"
        >
          <TextField
            label="Печалба"
            value={numeral(contractSum - totalSingle).format("0,0.00")}
            style={{
              minWidth: 150,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">лв.</InputAdornment>
              ),
            }}
            InputLabelProps={{ shrink: true }}
            disabled
          />
        </Tooltip>

        <Tooltip
          title="Прогнозна Печалба = (Сума по договор) - (Обща Бюджетна)"
          arrow
          placement="top"
        >
          <TextField
            label="Прогнозна печалба"
            value={numeral(contractSum - totalAgreed).format("0,0.00")}
            style={{
              minWidth: 150,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">лв.</InputAdornment>
              ),
            }}
            InputLabelProps={{ shrink: true }}
            disabled
          />
        </Tooltip>
      </Box>
      <Button
        disabled={
          status === 2
            ? true
            : localStorage.getItem("admin") === "true"
            ? false
            : ownerId !== localStorage.getItem("userId")
            ? true
            : false
        }
        style={{
          marginTop: "1%",
          textAlign: "center",
          backgroundColor: "#C0C0C0",
          color: "white",
          width: "12rem",
          marginBottom: 10,

          "&:hover": {
            color: "#C0C0C0	",
          },
        }}
        onClick={editProfit}
      >
        <EditIcon />
        Запиши
      </Button>
      <Payments
        projectId={projectId}
        ownerId={ownerId}
        payments={payments}
        contractSum={contractSum}
        status={status}
      />
    </Paper>
  );
};
export default ContractAndWin;
