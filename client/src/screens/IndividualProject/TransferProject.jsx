import React, { useState } from "react";
import {
  Button,
  Box,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
} from "@mui/material/";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import apiAddress from "../../globals/apiAddress";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import DialogLoader from "../../components/DialogLoader";
import AlertBox from "../../components/AlertBox";
import CompareArrowsIcon from "@material-ui/icons/CompareArrows";

const useStyles = makeStyles(() => ({
  containerStyle: {
    textAlign: "center",
    marginTop: "2%",
  },
  inputBox: {
    width: 300,
  },
}));

export default function TransferProject(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState();
  const [users, setUsers] = useState();
  const [owner, setOwner] = useState(props.ownerId);

  const handleClickOpen = () => {
    setOpen(true);
    setLoading(true);
    axios
      .get(`${apiAddress}/user`, {
        headers: {
          Authorization: "Basic " + localStorage.getItem("token"),
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setAlertMessage("Потребителят не може да бъде зареден");
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveRow = () => {
    axios({
      method: "put",
      url: `${apiAddress}/project/transfer`,
      data: {
        projectId: props.projectId,
        newOwner: owner,
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
        disabled={props.status === 2 ? true : false}
        style={{
          marginTop: "1%",
          textAlign: "center",
          backgroundColor: "rgba(111, 143, 175,1)",
          color: "white",
          width: "10rem",
          marginBottom: 10,
          backgroundColor: "rgba(111, 143, 175,0.5)",
          "&:hover": {
            color: "#C0C0C0	",
          },
        }}
        onClick={handleClickOpen}
      >
        <CompareArrowsIcon /> Трансферирай
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
          Трансферирай Проект
        </DialogTitle>
        <DialogContent
          style={{ display: "flex", justifyContent: "space-around" }}
        >
          <Box style={{ padding: 10 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Потребител</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={owner}
                label="Потребител"
                onChange={(event) => setOwner(event.target.value)}
                style={{ width: 300 }}
              >
                {users && users.length > 0
                  ? users.map((el) => (
                      <MenuItem value={el._id}>{el.name}</MenuItem>
                    ))
                  : null}
              </Select>
            </FormControl>
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
