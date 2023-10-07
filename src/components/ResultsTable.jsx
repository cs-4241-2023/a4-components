import React from "react";
import TableRow from "./TableRow";

function ResultsTable({ listOfTasks }) {
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
        <tbody>
          {listOfTasks.length > 0 ? (
            listOfTasks.map((task) => <TableRow key={task.id} task={task} />)
          ) : (
            <tr>
              <td
                colSpan={8}
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                No tasks in your list at the current moment. Feel free to add
                some.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}

export default ResultsTable;
