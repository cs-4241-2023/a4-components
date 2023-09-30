import React from 'react'
import './TaskDisplay.css'

function TaskDisplay({tasks, deleteTask}) {

    const handleRemoveTask = (id) => {
        deleteTask(id);
    }

    return (
        <>
        <section className="results">
            <section id="listBox">
                <ul>
                    <li id="headerItem">
                        <p className="list-label">Task Name</p>
                        <p className="list-label">Due Date</p>
                        <p className="list-label">Days Remaining</p>
                        <p className="list-label">Priority</p>
                    </li>
                    {tasks.map( (task) => (
                        <li className="task-item" key={task._id}>
                            <p className="list-label">{task.taskName}</p>
                            <p className="list-label">{task.dueDate}</p>
                            <p className="list-label">{task.daysRemaining}</p>
                            <p className="list-label">{task.priority}</p>
                            <button className="deleter" onClick={() => handleRemoveTask(task._id) }>x</button>
                        </li>
                    ))}
                </ul>
            </section>
        </section>
        </>
    )
}

export default TaskDisplay;