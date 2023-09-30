import { useEffect, useState } from 'react'
import './App.css'
import TaskEntry from './TaskEntry';
import TaskDisplay from './TaskDisplay';

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => { loadTasks() }, []);

  const loadTasks = async function() {
    const getResponse = await fetch(`/getTasks/`, {
      method: 'GET',
    });

    const text = await getResponse.text();
    const taskList = JSON.parse(text);

    setTasks(taskList);
  };

  const addTask = async function(taskObj) {
    const json = { taskName: taskObj.taskName, dueDate: taskObj.dueDate, priority: taskObj.priority };

    const postResponse = await fetch('/submitTasks', {
      method: 'POST',
      body: JSON.stringify(json)
    });

    loadTasks();
  }

  const deleteTask = async function(id) {
    const json = { _id: id };

    const postResponse = await fetch('/deleteTask', {
      method: 'POST',
      body: JSON.stringify(json)
    });

    loadTasks();
  }

  return (
    <>
      <TaskEntry addTask={addTask} />
      <TaskDisplay tasks={tasks} removeTask={removeTask} />
    </>
  )
}

export default App
