import React, { useState } from "react";
import MapPicker from "react-google-map-picker";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { useEffect } from "react";

const DefaultLocation = { lat: 42.698334, lng: 23.319941 };
const DefaultZoom = 10;

const LocationPicker = ({ setLocation }) => {
  const [defaultLocation, setDefaultLocation] = useState(DefaultLocation);
  const [zoom, setZoom] = useState(DefaultZoom);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function handleChangeLocation(lat, lng) {
    setLocation({ lat: lat, lng: lng });
  }

  function handleChangeZoom(newZoom) {
    setZoom(newZoom);
  }

  return (
    <div>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        style={{ marginTop: 10, width: 300 }}
      >
        Избери Локация
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth={"lg"}
      >
        <>
          <MapPicker
            defaultLocation={defaultLocation}
            zoom={zoom}
            mapTypeId="roadmap"
            style={{ height: "700px" }}
            onChangeLocation={handleChangeLocation}
            onChangeZoom={handleChangeZoom}
            apiKey="AIzaSyD07E1VvpsN_0FvsmKAj4nK9GnLq-9jtj8"
          />
          <div
            style={{
              textAlign: "center",
            }}
          >
            <Button
              onClick={handleClose}
              style={{
                margin: 5,
                width: 250,
              }}
              variant="outlined"
            >
              Избери
            </Button>
          </div>
        </>
      </Dialog>
    </div>
  );
};
export default LocationPicker;
