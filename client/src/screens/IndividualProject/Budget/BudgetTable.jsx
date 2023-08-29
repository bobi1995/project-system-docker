import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import numeral from "numeral";
import { makeStyles } from "@mui/styles";
import EditRow from "./EditRow";
import Documents from "./Documents";
import ContractAndWin from "./ContractAndWin";

const useStyles = makeStyles({
  tableBox: {
    display: "flex",
    justifyContent: "space-around",
  },

  rowStyle: {
    lineHeight: 1.1,
    width: "100%",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
});

const BudgetTable = ({
  data,
  projectId,
  status,
  contract,
  ownerId,
  setLoading,
  payments,
}) => {
  const classes = useStyles();
  //const [pageWa, setPageWa] = React.useState(0);
  // const [rowsPerPageWa, setRowsPerPageWa] = React.useState(10);
  let totalSingle = data.reduce((accumulator, object) => {
    const price = object.singlePrice ? object.singlePrice * object.quantity : 0;
    return accumulator + price;
  }, 0);

  let totalAgreed = data.reduce((accumulator, object) => {
    const price = object.agreedPrice ? object.agreedPrice * object.quantity : 0;
    return accumulator + price;
  }, 0);
  let totalDifference = totalAgreed - totalSingle;
  let totalWin = data.reduce((accumulator, object) => {
    const agreedPrice = object.agreedPrice ? object.agreedPrice : 0;
    const singlePrice = object.singlePrice ? object.singlePrice : 0;
    const win = object.quantity * (agreedPrice - singlePrice);
    if (object.position === "ОБЩО") {
      return accumulator;
    }
    return accumulator + win;
  }, 0);

  useEffect(() => {
    data.push({
      total: true,
      totalSingle: totalSingle,
      totalAgreed: totalAgreed,
      difference: totalDifference,
      totalWin: totalWin,
      position: "ОБЩО",
    });
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <ContractAndWin
        projectId={projectId}
        contract={contract}
        status={status}
        totalSingle={totalSingle}
        totalAgreed={totalAgreed}
        ownerId={ownerId}
        setLoading={setLoading}
        payments={payments}
      />
      {data.length > 1 ? (
        <div style={{ marginTop: 30, width: "100%" }}>
          <Paper>
            <TableContainer>
              <Table
                className={classes.table}
                size="small"
                aria-label="a dense table"
              >
                <TableHead>
                  <TableRow
                    style={{ backgroundColor: "rgba(53, 174, 182,0.5)" }}
                  >
                    <TableCell
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        backgroundColor: "#35AEB6",
                      }}
                    >
                      Позиция
                    </TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>
                      Размер
                    </TableCell>

                    <TableCell
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      Брой
                    </TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>
                      Покупна
                    </TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>
                      Обща Покупна
                    </TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>
                      Бюджетна
                    </TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>
                      Обща Бюджетна
                    </TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>
                      Разлика
                    </TableCell>

                    <TableCell style={{ color: "white", fontWeight: "bold" }}>
                      Доставчик
                    </TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>
                      Документи
                    </TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>
                      Редакция
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data
                    // .slice(
                    //   pageWa * rowsPerPageWa,
                    //   pageWa * rowsPerPageWa + rowsPerPageWa
                    // )
                    .map((row, ind) => (
                      <TableRow
                        key={ind}
                        style={
                          row.total
                            ? { backgroundColor: "rgba(53, 174, 182,0.5)" }
                            : {}
                        }
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          style={{
                            backgroundColor: row.total
                              ? "rgba(53, 174, 182,0.5)"
                              : "#35AEB6",
                            color: "white",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                          }}
                        >
                          <p style={row.total ? { fontWeight: "bold" } : {}}>
                            {row.position}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className={classes.rowStyle}>
                            {row.size && row.size !== "null" ? row.size : ""}
                          </p>
                        </TableCell>
                        <TableCell>{row.quantity}</TableCell>
                        <TableCell
                          style={
                            row.total
                              ? { fontWeight: "bold", color: "white" }
                              : {}
                          }
                        >
                          {row.total
                            ? ""
                            : `${numeral(row.singlePrice).format(
                                "0,0.00"
                              )} лв.`}
                        </TableCell>
                        <TableCell
                          style={
                            row.total
                              ? { fontWeight: "bold", color: "white" }
                              : {}
                          }
                        >
                          {row.total
                            ? numeral(row.totalSingle).format("0,0.00")
                            : numeral(row.singlePrice * row.quantity).format(
                                "0,0.00"
                              )}{" "}
                          лв.
                        </TableCell>
                        <TableCell
                          style={
                            row.total
                              ? { fontWeight: "bold", color: "white" }
                              : {}
                          }
                        >
                          {row.total
                            ? ""
                            : `${numeral(row.agreedPrice).format(
                                "0,0.00"
                              )} лв.`}
                        </TableCell>
                        <TableCell
                          style={
                            row.total
                              ? { fontWeight: "bold", color: "white" }
                              : {}
                          }
                        >
                          {row.total
                            ? numeral(row.totalAgreed).format("0,0.00")
                            : numeral(row.agreedPrice * row.quantity).format(
                                "0,0.00"
                              )}{" "}
                          лв.
                        </TableCell>
                        <TableCell
                          style={
                            row.total
                              ? row.totalWin > 0
                                ? { color: "green", fontWeight: "bold" }
                                : row.totalWin < 0
                                ? { color: "red", fontWeight: "bold" }
                                : { fontWeight: "bold", color: "white" }
                              : row.quantity *
                                  (row.agreedPrice - row.singlePrice) >
                                0
                              ? { color: "green", fontWeight: "bold" }
                              : row.quantity *
                                  (row.agreedPrice - row.singlePrice) <
                                0
                              ? { color: "red", fontWeight: "bold" }
                              : row.total
                              ? { fontWeight: "bold", color: "white" }
                              : { fontWeight: "bold" }
                          }
                        >
                          {row.total
                            ? numeral(row.totalWin).format("0,0.00")
                            : numeral(
                                row.quantity *
                                  (row.agreedPrice - row.singlePrice)
                              ).format("0,0.00")}{" "}
                          лв.
                        </TableCell>

                        <TableCell>
                          {row.provider && row.provider !== "null"
                            ? row.provider
                            : ""}
                        </TableCell>
                        <TableCell>
                          {row.total ? null : (
                            <Documents
                              rowData={row}
                              projectId={projectId}
                              setLoading={setLoading}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {row.total ? null : (
                            <EditRow
                              setLoading={setLoading}
                              rowData={row}
                              projectId={projectId}
                              status={status}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </div>
      ) : (
        <Typography
          sx={{ mt: 4, mb: 2 }}
          variant="h6"
          component="div"
          style={{ marginBottom: 50 }}
        >
          Няма въведени позиции
        </Typography>
      )}
    </div>
  );
};

export default BudgetTable;
