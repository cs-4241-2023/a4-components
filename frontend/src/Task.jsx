import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Task = ({ taskInfo={}, updateTasks }) => {
    const [dueDate, setDueDate] = useState(taskInfo.DueDate);
    const [priority, setPriority] = useState(taskInfo.Priority);
    const [taskName, setTaskName] = useState(taskInfo.TaskName);

    const updateTask = async (id, taskData) => {
        const requestData = {
            type: "updateTask",
            taskData: taskData,
            id: id,
        };
        
        await axios.post('/submit', requestData);
        updateTasks();
    }

    const handleDateChange = (e) => {
        if (e.target.value !== ""){
            setDueDate(e.target.value);
            updateTask(taskInfo._id, {...taskInfo, DueDate: e.target.value});
        }
    }

    const removeTask = async (id) => {
        const requestData = {
            type: "deleteTask",
            deleteRow: id,
        };
        
        await axios.post('/submit', requestData);
        updateTasks();
    }

    const updateTaskPriority = async (p) => {
        setPriority(p);
        updateTask(taskInfo._id, {...taskInfo, Priority: p});
    }

    //Determine What Task Deadline Message To Display
    function getTaskDeadlineLabel(taskDeadline) {
        const deadlineDate = new Date(taskDeadline);
        const today = new Date();
        const dayDifference = deadlineDate - today;
        const dayDifferenceInDays =
        Math.floor(dayDifference / (1000 * 60 * 60 * 24)) + 1;
    
        switch (true) {
        case dayDifferenceInDays < 0:
            return "Overdue";
        case dayDifferenceInDays === 0:
            return "Due Today";
        case dayDifferenceInDays === 1:
            return "Due Tomorrow";
        default:
            return formatDate(taskDeadline);
        }
    }

    //Format The Raw Date Input To mm/dd/yyyy
    function formatDate(newTaskDueDate) {
        const [yy, mm, dd] = newTaskDueDate.split("-");
        const formattedDate = `${mm}/${dd}/${yy}`;
        return formattedDate;
    }

    return (
        <tr className='task-item'>
            <td className='left-container'>
                <button className='Completion-Button' title='Complete The Task'  onClick={() => removeTask(taskInfo._id)}></button>
                <input
                    type='text'
                    value={taskName}
                    onBlur={() => 
                        updateTask(taskInfo._id, {...taskInfo, TaskName: taskName})
                    }
                    onChange={(e) => setTaskName(e.target.value)}
                ></input>
            </td>
            <td className='right-container'>
                <span className="datepicker-toggle hover-toggle">
                    <span className='overlay-text'>{getTaskDeadlineLabel(dueDate)}</span>
                    <input
                        type="date"
                        className="datepicker-input no-text"
                        value={dueDate}
                        onChange={handleDateChange}
                        onKeyDown={e => e.preventDefault()}
                    />
                </span>
                <button 
                    className={`LowPriority-Button ${priority === 1 ? 'active' : ''}`} 
                    title='Low Priority' 
                    onClick={() => updateTaskPriority(1)}
                />
                <button 
                    className={`MediumPriority-Button ${priority === 2 ? 'active' : ''}`} 
                    title='Medium Priority'
                    onClick={() => updateTaskPriority(2)}
                />
                <button 
                    className={`HighPriority-Button ${priority === 3 ? 'active' : ''}`} 
                    title='High Priority'
                    onClick={() => updateTaskPriority(3)}
                />
            </td>
        </tr>
    )
}
    
export default Task;