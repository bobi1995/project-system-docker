import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Button, Typography } from "@mui/material";
import numeral from "numeral";
import AddPayment from "./AddPayment";
import moment from "moment";
import EditPayment from "./EditPayment";

export default function DenseTable({
  projectId,
  ownerId,
  payments,
  contractSum,
  status,
}) {
  React.useEffect(() => {
    if (payments && payments.length > 0) {
      let totalAmount = 0;

      payments.map((el) => {
        const parsedObj = JSON.parse(el);
        return (totalAmount = totalAmount + parseInt(parsedObj.amount));
      });
      payments.push(
        JSON.stringify({
          description: "Общо",
          amount: totalAmount,
          total: true,
        })
      );
    }
  }, [payments]);
  return (
    <Box style={{ marginTop: 15 }}>
      <Typography
        style={{
          fontSize: 21,
          color: "#35AEB6",
          fontWeight: "bold",
        }}
      >
        Получени плащания
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableHead style={{ backgroundColor: "#35AEB6" }}>
            <TableRow>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>
                Описание
              </TableCell>
              <TableCell
                style={{ color: "white", fontWeight: "bold" }}
                align="right"
              >
                Сума
              </TableCell>
              <TableCell
                style={{ color: "white", fontWeight: "bold" }}
                align="right"
              >
                Дата
              </TableCell>
              <TableCell
                style={{ color: "white", fontWeight: "bold" }}
                align="right"
              >
                Редакция
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments && payments.length > 0 ? (
              payments.map((row, index) => {
                const tempRow = JSON.parse(row);
                return (
                  <TableRow
                    key={tempRow.description}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    style={
                      tempRow.total
                        ? {
                            backgroundColor: "#9AD6DA",
                          }
                        : {}
                    }
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      style={
                        tempRow.total
                          ? {
                              color: "white",
                              fontWeight: "bold",
                            }
                          : {}
                      }
                    >
                      {tempRow.description}
                    </TableCell>
                    <TableCell
                      align="right"
                      style={
                        tempRow.total
                          ? {
                              color: "white",
                              fontWeight: "bold",
                            }
                          : {}
                      }
                    >
                      {numeral(tempRow.amount).format("0,0.00")} (
                      {numeral((tempRow.amount / contractSum) * 100).format(
                        "0.00"
                      )}
                      % )
                    </TableCell>
                    <TableCell align="right">
                      {tempRow.total
                        ? ""
                        : moment(tempRow.payDate).format("DD-MMM-YYYY")}
                    </TableCell>
                    <TableCell align="right">
                      {tempRow.total ? (
                        ""
                      ) : (
                        <EditPayment
                          projectId={projectId}
                          rowData={{
                            description: tempRow.description,
                            amount: tempRow.amount,
                            payDate: tempRow.payDate,
                          }}
                          allPayments={payments}
                          index={index}
                          status={status}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <Typography
                style={{
                  textAlign: "center",
                  margin: "0 auto",
                }}
              >
                Няма плащания
              </Typography>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <AddPayment
        projectId={projectId}
        ownerId={ownerId}
        status={status}
        payments={payments}
      />
    </Box>
  );
}
