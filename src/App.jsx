import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Tasks() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const fetchTasks = async () => {
    try {
      const response = await fetch("/tasks", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setTodos(data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const submit = async event => {
    event.preventDefault();
    let id = uuidv4();

    const newTask = {
      id: id,
      task: task,
      dueDate: dueDate,
      description: description,
    };

    try {
      const response = await fetch("/add", {
        method: "POST",
        body: JSON.stringify(newTask),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setTodos([...todos, newTask]);
        setTask("");
        setDescription("");
        setDueDate("");
      }
    } catch (error) {
      console.error("Error submitting task");
    }
  };

  const edit = async (event, id) => {
    event.preventDefault();

    const newTask = {
      id: id,
      task: document.getElementById("task").value,
      dueDate: document.getElementById("dueDate").value,
      description: document.getElementById("description").value,
    };

    try {
      const response = await fetch("/edit", {
        method: "PUT",
        body: JSON.stringify(newTask),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setTask("");
        setDescription("");
        setDueDate("");
        const data = await response.json();
        setTodos(data);
        console.log("Updated resource:", data);
      }
    } catch (error) {
      console.error("Error updating resource:", error);
    }
  };

  const editTask = editedTask => {
    const button = document.getElementById("submitButton");
    button.textContent = "Edit Task";

    setTask(editedTask.task);
    setDueDate(editedTask.dueDate);
    setDescription(editedTask.description);

    const editUpdate = e => {
      edit(e, editedTask.id);
      button.textContent = "Submit Task";
      button.onclick = null;
    };

    button.onclick = editUpdate;
  };

  const deleteTask = async id => {
    try {
      const response = await fetch(`/delete/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const daysBetween = (date1, date2) => {
    const utcDate1 = Date.UTC(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate()
    );
    const utcDate2 = Date.UTC(
      date2.getFullYear(),
      date2.getMonth(),
      date2.getDate()
    );
    return Math.floor((utcDate2 - utcDate1) / (1000 * 60 * 60 * 24));
  };

  const priorityCalculator = dueDate => {
    const today = new Date();
    const dateDiff = daysBetween(today, new Date(dueDate));
    let priority = "P1";

    if (dateDiff > 7) {
      priority = "P3";
    } else if (dateDiff > 2) {
      priority = "P2";
    }
    return priority;
  };

  return (
    <>
      <div className="container mt-5">
        <h1 className="text-center">To-do List</h1>

        <div className="row justify-content-center mt-4">
          <div className="col-md-6">
            <form
              id="task-form"
              className="bg-light p-4 rounded border"
              onSubmit={e => submit(e)}
            >
              <div className="form-group">
                <label htmlFor="task">Task</label>
                <input
                  type="text"
                  id="task"
                  className="form-control"
                  placeholder="Task name"
                  value={task}
                  onChange={e => setTask(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="dueDate">Due Date</label>
                <input
                  type="date"
                  id="dueDate"
                  className="form-control"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  id="description"
                  className="form-control"
                  placeholder="Describe your task"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
              <button id="submitButton" className="btn btn-dark">
                Submit Task
              </button>
            </form>
          </div>
        </div>

        <div className="row mt-4 text-center">
          <div className="col">
            <table className="table table-bordered table-hover bg-light">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Description</th>
                  <th>Due Date</th>
                  <th>Priority</th>
                  <th>Buttons</th>
                </tr>
              </thead>
              <tbody>
                {todos.map(todo => (
                  <tr key={todo.id}>
                    <td>{todo.task}</td>
                    <td>{todo.description}</td>
                    <td>{todo.dueDate}</td>
                    <td>{priorityCalculator(todo.dueDate)}</td>
                    <td>
                      <button
                        className="mr-2 taskButton btn btn-dark"
                        onClick={() => editTask(todo)}
                      >
                        Edit
                      </button>
                      <button
                        className="taskButton btn btn-dark"
                        onClick={() => deleteTask(todo.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
