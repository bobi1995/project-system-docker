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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const useStyles = makeStyles(() => ({
  containerStyle: {
    textAlign: "center",
    marginTop: "2%",
  },
  inputBox: {
    width: 300,
  },
}));

export default function AddRow(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [payDate, setPayDate] = useState(new Date());
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
    const exist = props.payments.filter(
      (el) => JSON.parse(el).description === description
    );

    if (exist && exist.length > 0) {
      return setAlertMessage("Плащане с въведеното описание вече съществува");
    }
    axios({
      method: "post",
      url: `${apiAddress}/project/payment`,
      headers: {
        Authorization: "Basic " + localStorage.getItem("token"),
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      data: {
        projectId: props.projectId,
        payment: JSON.stringify({
          description,
          amount,
          payDate,
        }),
      },
    })
      .then((res) => {
        if (res.status === 200) {
          window.location.reload();
        } else setAlertMessage(res.data);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
        setAlertMessage(e);
      });
  };

  return (
    <div>
      <Button
        disabled={props.status === 2 ? true : false}
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
        onClick={handleClickOpen}
      >
        <AddCircleIcon /> Добави
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title" style={{ textAlign: "center" }}>
          Добави ново плащане
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
          <Button onClick={handleClose}>Откажи</Button>
          <Button onClick={saveRow} autoFocus>
            Запази
          </Button>
        </DialogActions>
      </Dialog>
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
}
