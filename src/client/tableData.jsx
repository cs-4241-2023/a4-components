import React from "react";
import { Button, Table } from "react-bootstrap";

function TableData({ entries }) {
  const data = Array.isArray(entries) ? entries : [];
  if (data == []) {
    return <div> </div>;
  }
  let totalHours = 0;
  return (
    <div>
      <Table striped hover bordered id="submissionTable">
        <thead>
          <tr>
            <th style={{ width: "200px" }}>Number of Hours</th>
            <th style={{ width: "200px" }}>Date</th>
            <th style={{ width: "200px" }}>Reason</th>
            <th style={{ width: "100px" }}>Delete</th>
          </tr>
        </thead>
        <tbody className="editable" id="dataRepresentation">
          {data.map((entry) => {
            totalHours += entry.numHours;
            return (
              <tr>
                <td>{entry.numHours}</td>
                <td>{entry.date}</td>
                <td>{entry.reason}</td>
                <td>
                  <Button className="btn-dark" style={{ marginLeft: "25px" }}>
                    X
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <hr />
      <Table striped bordered id="totalHoursTable" style={{ width: "250px" }}>
        <thead>
          <tr>
            <th style={{ width: "150px" }}>Total Hours:</th>
            <th>{totalHours}</th>
          </tr>
        </thead>
      </Table>
    </div>
  );
}

export default TableData;
