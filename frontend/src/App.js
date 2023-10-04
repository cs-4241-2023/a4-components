import './App.css';
import React, { useState, useEffect } from 'react';
import Task from './Task';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [currentDate, setCurrentDate] = useState('');
  const [tasks, setTasks] =  useState([]);
  const [inputValue, setInputValue] = useState('');
  const [inputPriority, setInputPriority] = useState(1);
  const [inputMyDay, setInputMyDay] = useState(true);
  const [inputDate, setInputDate] = useState(new Date());

  useEffect(() => {
    const dateAndTime = new Date();
    let dateString = dateAndTime.toDateString().split(" ");
    dateString = dateString[0] + ", " + dateString[1] + " " + dateString[2];
    setCurrentDate(dateString);
    newInputDate();
  }, []);

  useEffect(() => {
    updateTasks();
  }, []);

  const updateTasks = async () => {
    const response = await axios.get('/appdata');
    setTasks(response.data);
  }

  const addTask = async (e) => {
    e.preventDefault();
    if(inputValue && inputDate) {
      const taskData = {
        TaskName: inputValue,
        DueDate: inputDate,
        Priority: inputPriority,
        MyDay: true
      }

      const requestData = {
        type: "addTask",
        taskData: taskData
      }
    
      await axios.post('/submit', requestData);

      setInputValue("");
      setInputPriority(1);
      newInputDate();

      updateTasks();
    }
  }

  const handleDateChange = (e) => {
    if (e.target.value !== ""){
      setInputDate(e.target.value);
    }
  }

  const newInputDate = () => {
    const dateAndTime = new Date();
    const year = dateAndTime.getFullYear();
    const month = String(dateAndTime.getMonth() + 1).padStart(2, '0');
    const day = String(dateAndTime.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setInputDate(formattedDate);
  }

  const changePriority = (e, p) => {
    e.preventDefault();
    setInputPriority(p);
  }
  
  return (
    <div className="container">
      <div className="left-div">
        <table id="menu-table">
          <tbody>
            <tr>
              <td className="menu-row">
                <h3>My Day</h3>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="right-div">
        <h1>My Day</h1>
        <div id="current-date">
          {currentDate}
        </div>

        <div className="tasks-div">
          <table id="task-table">
            <tbody>
              { tasks.map((task) => (
                <Task
                  key={task._id}
                  taskInfo={task}
                  updateTasks={updateTasks}
                />
              )) }
            </tbody>
          </table>
        </div>

        <div className="create-task-div">
          <form className="create-task-container" onSubmit={addTask}>
            <div className="create-task-left-container">
              <button title="Add Task" className='AddTask-Button'><FontAwesomeIcon icon={faPlus}/></button>
              <input
                type="text" 
                placeholder="Type Here To Add A New Task" 
                id="task-input"
                onChange={(e) => setInputValue(e.target.value)}
                value={inputValue}
              />
            </div>
            <div className="create-task-right-container">
                <span className="datepicker-toggle">
                  <input
                    type="date"
                    className="datepicker-input date-text"
                    value={inputDate}
                    onChange={handleDateChange}
                    onKeyDown={e => e.preventDefault()}
                  />
                </span>
              <button title="Low Priority" className={`LowPriority-Button ${inputPriority === 1 ? 'active' : ''}`} onClick={(e) => changePriority(e, 1)}></button>
              <button title="Medium Priority" className={`MediumPriority-Button ${inputPriority === 2 ? 'active' : ''}`} onClick={(e) => changePriority(e, 2)}></button>
              <button title="High Priority" className={`HighPriority-Button ${inputPriority === 3 ? 'active' : ''}`} onClick={(e) => changePriority(e, 3)}></button>
              {/* <button title="Added To My Day" className={`MyDay-Button ${inputMyDay ? 'active' : ''}`} onClick={() => setInputMyDay(!inputMyDay)}></button> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;