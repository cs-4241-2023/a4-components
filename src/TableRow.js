import React from 'react';

function TableRow({ item, modifyData, deleteData }) {
  const formatDate = (fullDate) => {
    return fullDate.split("T")[0];
  };

  return (
    <tr>
      <td><input value={item.task} /></td>
      <td><input type="number" value={item.hours} /></td>
      <td><input type="date" value={formatDate(item.dueDate)} /></td>
      <td><input value={item.timeLeft} /></td>
      <td><input value={item.priority} /></td>
      <td><button onClick={() => deleteData(item.task)}>Delete</button></td>
      <td>
        <button onClick={() => modifyData(
          item._id,
          /* ... Other input references. Maybe use useRef or pass the values directly */
        )}>Modify</button>
      </td>
    </tr>
  );
}

export default TableRow;
