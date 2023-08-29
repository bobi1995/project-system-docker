import React, { useState } from "react";
import { Button, TextField, Box } from "@mui/material/";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import apiAddress from "../../globals/apiAddress";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import DialogLoader from "../../components/DialogLoader";
import AlertBox from "../../components/AlertBox";
import EditIcon from "@material-ui/icons/Edit";
import LocationPicker from "../../components/LocationPicker";

const useStyles = makeStyles(() => ({
  containerStyle: {
    textAlign: "center",
    marginTop: "2%",
  },
  inputBox: {
    width: 300,
  },
}));

export default function EditBudget(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [power, setPower] = useState(props.data.power);
  const [name, setName] = useState(props.data.name);
  const [location, setLocation] = useState(props.data.location);
  const [zoom, setZoom] = useState(10);

  const [type, setType] = useState(props.data.type);
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState();

  const onChangePower = (event) => {
    setPower(event.target.value);
  };

  const onChangeName = (event) => {
    setName(event.target.value);
  };

  const onChangeLocation = (event) => {
    setLocation(event.target.value);
  };

  const onChangeType = (event) => {
    setType(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveRow = () => {
    axios({
      method: "put",
      url: `${apiAddress}/project`,
      data: {
        name,
        location: JSON.stringify(location),
        power,
        type,
        projectId: props.projectId,
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
    <div style={{ marginRight: 10 }}>
      <Button
        disabled={
          localStorage.getItem("admin") === "true"
            ? false
            : props.data.owner._id !== localStorage.getItem("userId")
            ? true
            : props.data.status === 2
            ? true
            : false
        }
        style={{
          marginTop: "1%",
          textAlign: "center",
          backgroundColor: "#C0C0C0",
          color: "white",
          width: "10rem",
          marginBottom: 10,
          backgroundColor: "rgba(255,165,0,0.5)",
          "&:hover": {
            color: "#C0C0C0	",
          },
        }}
        onClick={handleClickOpen}
      >
        <EditIcon /> Редактирай
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xl"
      >
        <DialogTitle id="alert-dialog-title" style={{ textAlign: "center" }}>
          Редактирай Проект
        </DialogTitle>
        <DialogContent
          style={{ display: "flex", justifyContent: "space-around" }}
        >
          <Box>
            <Box style={{ marginTop: 10 }}>
              <TextField
                id="outlined-name"
                label="Име"
                className={classes.inputBox}
                onChange={onChangeName}
                value={name}
              />
            </Box>
            <Box style={{ marginTop: 10 }}>
              <TextField
                id="outlined-email"
                label="Мощност"
                className={classes.inputBox}
                onChange={onChangePower}
                value={power}
              />
            </Box>
            <LocationPicker
              location={location}
              zoom={zoom}
              setLocation={setLocation}
              setZoom={setZoom}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={saveRow} autoFocus>
            Запази
          </Button>
          <Button onClick={handleClose}>Откажи</Button>
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
