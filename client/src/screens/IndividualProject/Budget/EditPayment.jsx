import React, { useState } from "react";
import { Button, TextField, Box } from "@mui/material/";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import apiAddress from "../../../globals/apiAddress";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import DialogLoader from "../../../components/DialogLoader";
import AlertBox from "../../../components/AlertBox";
import EditIcon from "@material-ui/icons/Edit";
import DatePicker from "react-datepicker";

const useStyles = makeStyles(() => ({
  containerStyle: {
    textAlign: "center",
    marginTop: "2%",
  },
  inputBox: {
    width: 300,
  },
}));
export default function EditPayment(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState(props.rowData.description);
  const [amount, setAmount] = useState(props.rowData.amount);
  const [payDate, setPayDate] = useState(new Date(props.rowData.payDate));
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState();

  const onChangeDescription = (event) => {
    setDescription(event.target.value);
  };

  const onChangeAmount = (event) => {
    setAmount(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveRow = () => {
    const newPayments = props.allPayments;
    newPayments[props.index] = JSON.stringify({
      description,
      amount,
      payDate,
    });

    const finalSend = newPayments.filter((el) => !JSON.parse(el).total);

    axios({
      method: "put",
      url: `${apiAddress}/project`,
      data: {
        projectId: props.projectId,
        payments: finalSend,
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
        setAlertMessage(e);
      });
  };

  const deleteRow = () => {
    const newPayments = props.allPayments;

    newPayments.splice(props.index, 1);
    const finalSend = newPayments.filter((el) => !JSON.parse(el).total);

    axios({
      method: "put",
      url: `${apiAddress}/project`,
      data: {
        projectId: props.projectId,
        payments: finalSend,
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
        setAlertMessage(e);
      });
  };

  return (
    <div>
      <Button
        disabled={props.status === 2 ? true : false}
        style={{
          textAlign: "center",
          color: "white",
          "&:hover": {
            color: "#C0C0C0	",
          },
        }}
        onClick={handleClickOpen}
      >
        <EditIcon style={{ color: "red" }} />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xl"
      >
        <DialogTitle id="alert-dialog-title" style={{ textAlign: "center" }}>
          Редактирай Плащане
        </DialogTitle>
        <DialogContent
          style={{ display: "flex", justifyContent: "space-around" }}
        >
          <Box>
            <Box style={{ marginTop: 10 }}>
              <TextField
                id="outlined-name"
                label="Описание"
                className={classes.inputBox}
                onChange={onChangeDescription}
                value={description}
                required
              />
            </Box>
            <Box style={{ marginTop: 10 }}>
              <TextField
                id="outlined-email"
                label="Сума"
                className={classes.inputBox}
                onChange={onChangeAmount}
                value={amount}
                required
                type="number"
              />
            </Box>
            <Box style={{ marginTop: 10, textAlign: "center" }}>
              <DatePicker
                selected={payDate}
                onChange={(date) => setPayDate(date)}
                inline
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={saveRow} autoFocus>
            Запази
          </Button>
          <Button onClick={handleClose}>Откажи</Button>

          <Button
            onClick={deleteRow}
            style={{
              position: "absolute",
              left: 0,
              color: "white",
              backgroundColor: "red",
              marginLeft: 10,
            }}
          >
            Изтрий
          </Button>
        </DialogActions>
      </Dialog>
      {alertMessage ? (
        <AlertBox
          success={false}
          text={alertMessage}
          display={setAlertMessage}
        />
      ) : null}
    </div>
  );
}
