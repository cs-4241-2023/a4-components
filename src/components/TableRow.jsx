import React from "react";

function TableRow({ task, deleteTask }) {
  return (
    <tr>
      {/* Table structure for each task: 
            <th>Task Name</th>
            <th>Task Description</th>
            <th>Task Created Date</th>
            <th>Task Deadline</th>
            <th>Task Priority</th>
            <th>Total Time Alloted</th>
            <th>Time Remaining</th>
            <th>Delete?</th>  */}
      <td>{task.taskName}</td>
      <td>{task.taskDescription}</td>
      <td>{task.taskCreated}</td>
      <td>{task.taskDeadline}</td>
      <td>{task.taskPriority}</td>
      <td>{task.totalTime}</td>
      <td>{task.timeRemaining < 0 ? "OVERDUE" : task.timeRemaining}</td>
      <td>
        <button onClick={() => deleteTask(task.id)} className="delete-btn">
          X
        </button>
      </td>
    </tr>
  );
}

export default TableRow;
