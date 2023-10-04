import React, { useState } from 'react';

function TableRow({ item, modifyData, deleteData }) {
  const formatDate = (fullDate) => {
    return fullDate.split("T")[0];
  };

  const [task, setTask] = useState(item.task);
  const [hours, setHours] = useState(item.hours);
  const [dueDate, setDueDate] = useState(formatDate(item.dueDate));
  const [timeLeft, setTimeLeft] = useState(item.timeLeft);
  const [priority, setPriority] = useState(item.priority);

  return (
    <tr>
      <td><input value={task} onChange={(e) => setTask(e.target.value)} /></td>
      <td><input type="number" value={hours} onChange={(e) => setHours(e.target.value)} /></td>
      <td><input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></td>
      <td><input value={timeLeft} onChange={(e) => setTimeLeft(e.target.value)} /></td>
      <td><input value={priority} onChange={(e) => setPriority(e.target.value)} /></td>
      <td><button onClick={() => deleteData(item.task)}>Delete</button></td>
      <td>
        <button onClick={() => modifyData(
          item._id,
          { 
            task,
            hours: parseFloat(hours),
            dueDate: new Date(dueDate),
            timeLeft,
            priority 
          }
        )}>Modify</button>
      </td>
    </tr>
  );
}

export default TableRow;
