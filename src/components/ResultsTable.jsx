import React from "react";

function ResultsTable() {
  return (
    <>
      <table id="tasksTable">
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Task Description</th>
            <th>Task Created Date</th>
            <th>Task Deadline</th>
            <th>Task Priority</th>
            <th>Total Time Alloted</th>
            <th>Time Remaining</th>
            <th>Delete?</th>
          </tr>
        </thead>
      </table>
    </>
  );
}

export default ResultsTable;
