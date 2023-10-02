import React, { useEffect, useState, useRef } from 'react';
import Header from './Header';
import TableRow from './TableRow';

function App() {
  const [data, setData] = useState([]);
  const taskRef = useRef(null);
  const hoursRef = useRef(null);
  const dueDateRef = useRef(null);

  useEffect(() => {
    if (window.location.pathname === '/index.html') {
      populateTable();
    }
  }, []);

  const formatDate = (fullDate) => {
    return fullDate.split("T")[0];
  };

  const populateTable = async () => {
    try {
      const response = await fetch("/api/getData");
      const fetchedData = await response.json();
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const modifyData = async (id, updatedData) => {
    try {
      const response = await fetch(`/api/modifyData/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const result = await response.text();
      console.log("Server response:", result);
      populateTable();
    } catch (error) {
      console.error("Error modifying data:", error);
    }
  };



  const deleteData = async (taskToDelete) => {
    try {
      const response = await fetch('/api/data', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: taskToDelete }),
      });

      if (response.ok) {
        console.log(await response.text());
        await populateTable();
      } else {
        console.error("Error deleting data:", await response.text());
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const json = {
      task: taskRef.current.value,
      hours: parseFloat(hoursRef.current.value),
      dueDate: dueDateRef.current.value,
    };

    const body = JSON.stringify(json);

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      const text = await response.text();

      if (!response.ok) {
        window.alert(`Error: ${text}`);
        return;
      }
      console.log("Response:", text);
      await populateTable();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const signOut = async () => {
    fetch('/api/logout', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.ok) {
          window.location.href = '/login.html';  // Redirect to login page or wherever you'd like after logging out
        } else {
          console.error('Failed to log out');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Header signOut={signOut} />
      <section style={{ width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <form style={{ marginBottom: '100px' }} onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="task">Task:</label>
            <textarea
              style={{ width: '100%', height: '100px' }}
              ref={taskRef}
              name="task"
            />
          </div>

          <div className="form-group">
            <label htmlFor="hours">Hours it will take:</label>
            <input
              type="number"
              id="hours"
              name="hours"
              step="0.01"
              min="0"
              placeholder="Enter hours"
              ref={hoursRef}
            />
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date:</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              ref={dueDateRef}
            />
          </div>

          <button type="submit">Submit</button>
        </form>

      </section>
      <section className="table-container" style={{ width: '100%', marginTop: '20px' }}>
    <table id="data-table">
        <thead>
            <tr>
            <th>Task</th>
            <th>Hours</th>
            <th class="due-date-header">Due Date</th>
            <th>Time Left</th>
            <th>Priority</th>
            <th class="no-header"></th>
            <th class="no-header"></th>
            </tr>
        </thead>
        <tbody>
            {data.map((item) => (
                <TableRow
                    key={item._id}
                    item={item}
                    modifyData={modifyData}
                    deleteData={deleteData}
                />
            ))}
        </tbody>
    </table>
</section>

    </div>
  );
}

export default App;
