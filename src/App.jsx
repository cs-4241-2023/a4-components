import { useState, useEffect } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import "./css/main.css";

function App() {
  const [listOfTasks, setListOfTasks] = useState([]);

  useEffect(() => {
    const tasks = fetch("/api/tasks")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok" + response.statusText);
        }
        return response.json();
      })
      .then((data) => setListOfTasks(data))
      .catch((error) => console.log(error));
  }, []);

  // need to finish this function
  const addTask = (task) => {
    fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok" + response.statusText);
        }
        return response.json();
      })
      .then((newTasksList) => {
        setListOfTasks(newTasksList);
      })
      .catch((error) => console.log(error));
  };

  const deleteTask = (id) => {
    fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok" + response.statusText);
        }
        return response.json();
      })
      .then((newTasksList) => {
        setListOfTasks(newTasksList);
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <div id="flex-container">
        <Header />
        <Main
          listOfTasks={listOfTasks}
          deleteTask={deleteTask}
          addTask={addTask}
        />
        <Footer />
      </div>
    </>
  );
}

export default App;
