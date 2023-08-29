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
import history from "../components/history";
import numeral from "numeral";
import MaterialTable from "material-table";
import moment from "moment";
import { Button } from "@mui/material";

const ProjectsTable = (props) => {
  const displayData = props.data;
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
          title: "Статус",
          field: "status",
          render: (rowData) =>
            rowData.status === 0 ? (
              <Brightness1 style={{ color: "rgba(255, 0, 0,0.9)" }} />
            ) : rowData.status === 1 ? (
              <Brightness1 style={{ color: "rgba(245, 229, 27,0.9)" }} />
            ) : (
              <Brightness1 style={{ color: "rgba(0,128,0,0.9)" }} />
            ),
          cellStyle: {
            width: "3%",
            textAlign: "center",
          },
          headerStyle: {
            width: "3%",
            textAlign: "center",
          },
        },
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
              onClick={() => history.push(`/project/${rowData._id}`)}
            >
              {rowData.name}
            </Button>
          ),
        },

        {
          title: "Сума по договор",
          field: "sum",
          render: (rowData) =>
            rowData.contractSum
              ? `${numeral(rowData.contractSum).format("0,0")} лв.`
              : "Няма въведена",
        },
        {
          title: "Печалба",
          field: "win",
          render: (rowData) => {
            let totalSingle = rowData.budget
              ? rowData.budget.reduce((accumulator, object) => {
                  const price = object.singlePrice
                    ? object.singlePrice * object.quantity
                    : 0;
                  return accumulator + price;
                }, 0)
              : 0;

            return rowData.contractSum
              ? `${numeral(rowData.contractSum - totalSingle).format(
                  "0,0"
                )} лв.`
              : "Няма въведена";
          },
        },
        {
          title: "Прогнозна Печалба",
          field: "win",
          render: (rowData) => {
            let totalAgreed = rowData.budget
              ? rowData.budget.reduce((accumulator, object) => {
                  const price = object.agreedPrice
                    ? object.agreedPrice * object.quantity
                    : 0;
                  return accumulator + price;
                }, 0)
              : 0;

            return rowData.contractSum
              ? `${numeral(rowData.contractSum - totalAgreed).format(
                  "0,0"
                )} лв.`
              : "Няма въведена";
          },
        },
        {
          title: "Тип",
          field: "type",
          render: (rowData) =>
            rowData.type === "1"
              ? "ЕСКО"
              : rowData.type === "2"
              ? "Собствен"
              : "СМР",
        },
        {
          title: "Мощност",
          field: "power",
          render: (rowData) => rowData.power,
        },
        {
          title: "Стартова Дата",
          field: "startData",
          render: (rowData) =>
            moment(new Date(rowData.startDate)).format("DD-MMM-yyyy"),
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

export default ProjectsTable;
