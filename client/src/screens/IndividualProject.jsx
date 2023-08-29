import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import apiAddress from "../globals/apiAddress";
import axios from "axios";
import DialogLoader from "../components/DialogLoader";
import AlertBox from "../components/AlertBox";
import GridPaper from "../components/GridPaper";
import PowerIcon from "@material-ui/icons/Power";
import FingerprintIcon from "@material-ui/icons/Fingerprint";
import AccessibilityIcon from "@material-ui/icons/Accessibility";
import DateRangeIcon from "@material-ui/icons/DateRange";
import moment from "moment";
import Budget from "./IndividualProject/Budget";
import Brightness1Icon from "@material-ui/icons/Brightness1";
import EditProject from "./IndividualProject/EditProject";
import GoogleMap from "./IndividualProject/GoogleMap";
import CloseProject from "./IndividualProject/CloseProject";
import DeleteProject from "./IndividualProject/DeleteProject";
import PicturesGallery from "./IndividualProject/PicturesGallery";
import TableLibrary from "./IndividualProject/TableLibrary";
import TransferProject from "./IndividualProject/TransferProject";
const useStyles = makeStyles({
  container: {
    textAlign: "center",
    marginTop: "3rem",
  },
  textStyle: {
    color: "blue",
  },
});
const IndividualProject = (props) => {
  const classes = useStyles();
  const [alertMessage, setAlertMessage] = useState("");
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${apiAddress}/project/${props.match.params.projectId}`, {
        headers: {
          Authorization: "Basic " + localStorage.getItem("token"),
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => {
        setData(res.data);

        if (res.data.budget.length > 0) {
          let temp = 0;

          res.data.budget.map((el) => {
            if (el.total) {
              return null;
            } else return (temp = el.agreedPrice * el.quantity + temp);
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setAlertMessage("Потребителят не може да бъде зареден");
      });
  }, []);

  const uploadPictures = (event) => {
    // Create an object of formData
    const formData = new FormData();
    const selectedFile = event.target.files;

    // Update the formData object
    formData.append("projectId", props.match.params.projectId);

    if (selectedFile.length < 1) {
      return null;
    }

    for (let i = 0; i < selectedFile.length; i++) {
      formData.append(`pictures`, selectedFile[i], selectedFile[i].name);
    }

    axios({
      method: "post",
      url: `${apiAddress}/project/pictures`,
      headers: {
        Authorization: "Basic " + localStorage.getItem("token"),
        "Access-Control-Allow-Origin": "*",
      },
      data: formData,
    })
      .then((res) => {
        if (res.status === 200) {
          window.location.reload();
        } else setAlertMessage("Възникна проблем с качването на файла");
      })
      .catch((e) => {
        setLoading(false);
        setAlertMessage(e);
      });
  };

  const deletePictures = (selectedFile) => {
    axios({
      method: "delete",
      url: `${apiAddress}/project/pictures`,
      headers: {
        Authorization: "Basic " + localStorage.getItem("token"),
        "Access-Control-Allow-Origin": "*",
      },
      data: {
        fileName: selectedFile,
        projectId: props.match.params.projectId,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          window.location.reload();
        } else setAlertMessage("Възникна проблем с изтриването на файла");
      })
      .catch((e) => {
        setLoading(false);
        setAlertMessage(e);
      });
  };

  return (
    <Box className={classes.container}>
      {data ? (
        <Box>
          <Typography style={{ fontSize: 27, fontFamily: "Open Sans" }}>
            <Brightness1Icon
              style={
                data.status === 0
                  ? { color: "red" }
                  : data.status === 1
                  ? { color: "yellow" }
                  : { color: "green" }
              }
            />
            {data.name}
          </Typography>
          {data.status === 2 ? null : (
            <Box style={{ display: "flex", justifyContent: "center" }}>
              <TransferProject
                projectId={props.match.params.projectId}
                ownerId={data.owner._id}
                status={data.status}
              />
              <EditProject
                data={data}
                projectId={props.match.params.projectId}
              />
              <CloseProject
                projectId={props.match.params.projectId}
                data={data}
              />
              {localStorage.getItem("admin") === "true" ? (
                <DeleteProject projectId={props.match.params.projectId} />
              ) : null}
            </Box>
          )}
          <Box
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: 30,
            }}
          >
            <GridPaper
              data={data.power}
              name="Мощност"
              icon={PowerIcon}
              smalltext="kWp"
              staticon={PowerIcon}
            />
            <GridPaper
              data={
                data.type === "1"
                  ? "ЕСКО"
                  : data.type === "2"
                  ? "Собствен"
                  : "СМР"
              }
              name="Тип"
              icon={FingerprintIcon}
              smalltext="типът на проекта"
              staticon={FingerprintIcon}
            />
            <GridPaper
              data={moment(new Date(data.startDate)).format("DD-MMM-yyyy")}
              name="Старт"
              icon={DateRangeIcon}
              smalltext="стартираща дата"
              staticon={DateRangeIcon}
            />
            <GridPaper
              data={data.owner.name}
              name="Възложен"
              icon={AccessibilityIcon}
              smalltext="служител"
              staticon={AccessibilityIcon}
            />
          </Box>
          <Box
            style={{
              width: "100%",
            }}
          >
            <TableLibrary data={data} setLoading={setLoading} />
          </Box>

          <Box>
            <Budget
              setLoading={setLoading}
              projectId={data._id}
              data={data.budget}
              status={data.status}
              contract={data.contractSum}
              ownerId={data.owner._id}
              payments={data.payments}
            />
          </Box>
          <PicturesGallery
            projectId={data._id}
            images={data.pictures}
            uploadPictures={uploadPictures}
            deletePictures={deletePictures}
          />
          <GoogleMap address={data.location} />
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

export default IndividualProject;
