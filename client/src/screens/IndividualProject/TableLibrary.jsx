import React, { useState } from "react";
import MaterialTable from "material-table";
import {
  ArrowUpward,
  FirstPage,
  LastPage,
  ChevronLeft,
  ChevronRight,
  GetApp,
  Delete,
  CloudUpload,
} from "@material-ui/icons";
import SearchIcon from "@material-ui/icons/Search";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import shareServer from "../../globals/shareServer";
import { Button } from "@mui/material";
import axios from "axios";
import apiAddress from "../../globals/apiAddress";

const constructData = (fileType, parentIndex, category) => {
  if (fileType && fileType.length > 0) {
    return fileType.map((el, ind) => {
      const obj = {
        id: parentIndex + ind,
        fileName: el,
        category: category,
        type: "child",
        parentId: parentIndex,
      };

      return obj;
    });
  }
};

const TableLibrary = (props) => {
  const [alertMessage, setAlertMessage] = useState("");

  const uploadFunction = (fileType, selectedFile) => {
    props.setLoading(true);
    // Create an object of formData
    const formData = new FormData();
    // Update the formData object
    formData.append("projectId", props.data._id);
    formData.append(fileType, selectedFile, selectedFile.name);

    axios({
      method: "post",
      url: `${apiAddress}/project/${fileType}`,
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
        props.setLoading(false);
        setAlertMessage(e);
      });
  };

  const deleteFunction = (fileType, selectedFile) => {
    props.setLoading(true);

    axios({
      method: "delete",
      url: `${apiAddress}/project/${fileType}`,
      headers: {
        Authorization: "Basic " + localStorage.getItem("token"),
        "Access-Control-Allow-Origin": "*",
      },
      data: {
        fileName: selectedFile,
        projectId: props.data._id,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          window.location.reload();
        } else setAlertMessage("Възникна проблем с изтриването на файла");
      })
      .catch((e) => {
        props.setLoading(false);
        setAlertMessage(e);
      });
  };

  let mainArray = [
    {
      id: 3,
      name: "Симулация",
      fileLenght: props.data.simulation.length,
      category: "simulation",

      type: "adult",
    },
    {
      id: 1,
      name: "Оферта",
      fileLenght: props.data.offer.length,
      category: "offer",
      type: "adult",
    },
    {
      id: 4,
      name: "Договор",
      fileLenght: props.data.contract.length,
      category: "contract",

      type: "adult",
    },
    {
      id: 2,
      name: "График",
      fileLenght: props.data.schedule.length,
      category: "schedule",

      type: "adult",
    },
    {
      id: 6,
      name: "Становище",
      fileLenght: props.data.standpoint.length,
      category: "standpoint",

      type: "adult",
    },
    {
      id: 8,
      name: "Документи",
      fileLenght: props.data.projectDocs.length,
      category: "projectDocs",

      type: "adult",
    },
    {
      id: 7,
      name: "Разрешително",
      fileLenght: props.data.permission.length,
      category: "permission",

      type: "adult",
    },
    {
      id: 5,
      name: "Подизпълнител",
      fileLenght: props.data.subcontractor.length,
      category: "subcontractor",

      type: "adult",
    },
  ];

  const tableData = mainArray
    .concat(
      constructData(props.data.offer, 1, "offer"),
      constructData(props.data.schedule, 2, "schedule"),
      constructData(props.data.simulation, 3, "simulation"),
      constructData(props.data.contract, 4, "contract"),
      constructData(props.data.subcontractor, 5, "subcontractor"),
      constructData(props.data.standpoint, 6, "standpoint"),
      constructData(props.data.permission, 7, "permission"),
      constructData(props.data.projectDocs, 8, "projectDocs")
    )
    .filter((el) => el !== undefined);
  return (
    <MaterialTable
      title="Документи към проекта"
      style={{ marginTop: 35, marginBottom: 35, width: "100%" }}
      icons={{
        Filter: React.forwardRef((props, ref) => <SearchIcon ref={ref} />),
        Search: React.forwardRef((props, ref) => <SearchIcon ref={ref} />),
        ResetSearch: React.forwardRef((props, ref) => (
          <RotateLeftIcon ref={ref} />
        )),
        DetailPanel: React.forwardRef((props, ref) => (
          <ChevronRight {...props} ref={ref} />
        )),
        SortArrow: ArrowUpward,
        FirstPage: FirstPage,
        LastPage: LastPage,
        NextPage: ChevronRight,
        PreviousPage: ChevronLeft,
        Export: GetApp,
      }}
      data={tableData}
      columns={[
        {
          title: "Категория",
          field: "fileLenght",
          render: (rowData) => rowData.name,
          cellStyle: (rowData) => {
            return {
              width: "15%",
              backgroundColor: rowData === 0 ? "#FF6666" : "#35B67E",
              color: "white",
            };
          },
          headerStyle: {
            backgroundColor: "#35B67E",
          },
        },
        {
          title: "Брой файлове",
          field: "fileLenght",
          cellStyle: {
            width: "10%",
          },
        },

        {
          title: "Прикачи",
          field: "upload",
          render: (rowData) =>
            rowData.name ? (
              <>
                <label
                  htmlFor={`${rowData.id}`}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <CloudUpload
                    fontSize="medium"
                    style={{
                      verticalAlign: "middle",
                    }}
                  />{" "}
                  Избери файл
                </label>
                <input
                  id={`${rowData.id}`}
                  style={{
                    display: "none",
                  }}
                  type="file"
                  required
                  onChange={(event) =>
                    uploadFunction(rowData.category, event.target.files[0])
                  }
                  disabled={
                    localStorage.getItem("admin") === "true"
                      ? false
                      : props.data.owner._id !== localStorage.getItem("userId")
                      ? true
                      : props.data.status === 2
                      ? true
                      : false
                  }
                />
              </>
            ) : null,
          cellStyle: {
            width: "10%",
          },
        },
        {
          title: "Файл",
          field: "fileName",
          render: (rowData) => {
            return (
              <Button
                onClick={async () => {
                  window.open(
                    `${shareServer}\\${props.data._id}\\${rowData.category}\\${rowData.fileName}`
                  );
                }}
                style={{
                  padding: 0,
                }}
              >
                {rowData.fileName}
              </Button>
            );
          },
          cellStyle: {
            width: "62%",
          },
        },
        {
          title: "Изтрий",
          field: "delete",
          render: (rowData) =>
            rowData.fileName ? (
              <Delete
                disabled={props.data.status === 2 ? true : false}
                onClick={() =>
                  deleteFunction(rowData.category, rowData.fileName)
                }
              />
            ) : null,
          cellStyle: {
            width: "3%",
          },
        },
      ]}
      parentChildData={(row, rows) => rows.find((a) => a.id === row.parentId)}
      options={{
        paging: false,
        rowStyle: (rowData) => ({
          backgroundColor: rowData.name ? "white" : "#e7f8f0",
        }),
        headerStyle: {
          backgroundColor: "#88dcb7",
          color: "white",
          fontWeight: "bold",
        },
        search: false,
        sorting: false,
      }}
    />
  );
};

export default TableLibrary;
