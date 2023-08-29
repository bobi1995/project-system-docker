import React, { useState, useEffect } from "react";
import {
  ArrowUpward,
  FirstPage,
  LastPage,
  ChevronLeft,
  ChevronRight,
  GetApp,
  Brightness1,
} from "@material-ui/icons";
import SearchIcon from "@material-ui/icons/Search";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import { makeStyles } from "@mui/styles";
import history from "../../components/history";
import numeral from "numeral";
import MaterialTable from "material-table";
import moment from "moment";
import { Button } from "@mui/material";

const useStyles = makeStyles(() => ({
  containerStyle: {
    textAlign: "center",
    marginTop: "2%",
  },
  nameStyle: {
    color: "#3F51B5",
    fontSize: 21,
  },
  tableContainer: {
    width: "50%",
    margin: "0 auto",
  },
}));

const UsersTable = (props) => {
  const classes = useStyles();
  const [displayData, setDisplayData] = useState(props.data);

  return (
    <MaterialTable
      style={{
        width: "100%",
        marginTop: 50,
      }}
      icons={{
        Filter: React.forwardRef((props, ref) => <SearchIcon ref={ref} />),
        Search: React.forwardRef((props, ref) => <SearchIcon ref={ref} />),
        ResetSearch: React.forwardRef((props, ref) => (
          <RotateLeftIcon ref={ref} />
        )),
        SortArrow: ArrowUpward,
        FirstPage: FirstPage,
        LastPage: LastPage,
        NextPage: ChevronRight,
        PreviousPage: ChevronLeft,
        Export: GetApp,
      }}
      title="Всички проекти"
      columns={[
        {
          title: "Име",
          field: "name",
          cellStyle: {
            backgroundColor: "#35B67E",
            color: "#FFF",
          },
          headerStyle: {
            backgroundColor: "#35B67E",
          },
          render: (rowData) => (
            <Button
              style={{
                padding: 0,
                color: "white",
                textTransform: "none",
                textDecoration: "underline",
              }}
              onClick={() => history.push(`/user/${rowData._id}`)}
            >
              {rowData.name}
            </Button>
          ),
        },
        {
          title: "Имейл",
          field: "email",
          //   cellStyle: {
          //     backgroundColor: "#35B67E",
          //     color: "#FFF",
          //   },
          //   headerStyle: {
          //     backgroundColor: "#35B67E",
          //   },
        },
        {
          title: "Права",
          field: "owner",
          render: (rowData) =>
            rowData.isAdmin ? "Администратор" : "Обикновен потребител",
        },
        {
          title: "Активни Проекти",
          field: "projects",
          render: (rowData) =>
            rowData.projects
              ? rowData.projects.filter((el) => el.status !== 2).length
              : 0,
        },
        {
          title: "Завършени Проекти",
          field: "projects",
          render: (rowData) =>
            rowData.projects
              ? rowData.projects.filter((el) => el.status === 2).length
              : 0,
        },
      ]}
      data={displayData}
      options={{
        headerStyle: {
          backgroundColor: "#88dcb7",
          color: "#FFF",
        },
        paging: false,
        sorting: false,
      }}
    />
  );
};

export default UsersTable;
