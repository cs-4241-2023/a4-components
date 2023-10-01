import { useState, useEffect } from 'react'
import 'bulma/css/bulma.css';
import './TaskEntry.css'

function TaskEntry({addTask}) {
    const [taskName, setTaskName] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("none");
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        setIsButtonDisabled(taskName === "" || dueDate === "");
    }, [taskName, dueDate]);

    const handleTaskNameChange = (event) => {
        setTaskName(event.target.value);
    };
    
    const handleDueDateChange = (event) => {
        setDueDate(event.target.value);
    };
    
    const handlePriorityChange = (event) => {
        setPriority(event.target.value);
    };

    const handleAddTask = () => {
        const newTask = { taskName: taskName, dueDate: dueDate, priority: priority };
        addTask(newTask);
        setTaskName("");
        setDueDate("");
        setPriority("none");
    }

    return (
        <>
        <header>
            <form className="inputs">
                <div className="field">
                    <label className="label" htmlFor="taskName">Task:</label>
                    <div className="control">
                        <input className="input" type="text" placeholder="Enter task..." value={taskName} onChange={handleTaskNameChange} id="taskName" required/>
                    </div>
                </div>

                <div className="field">
                    <label className="label" htmlFor="dueDate">Due Date:</label>
                    <div className="control">
                        <input className="input" type="date" value={dueDate} onChange={handleDueDateChange} id="dueDate" required/>
                    </div>
                </div>

                <div className="field">
                    <label className="label" htmlFor="priorityFlag">Priority:</label>
                    <div className="control">
                        <div className="select">
                            <select value={priority} onChange={handlePriorityChange} id="priorityFlag">
                                <option value="none">None</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="field">
                    <label className="label" htmlFor="addTaskButton">&nbsp;</label>
                    <div className="control">
                        <button className="button is-primary" onClick={handleAddTask} id="addTaskButton" type="button" disabled={isButtonDisabled}>Add</button>
                    </div>
                </div>
            </form>
        </header>
        </>
    )
}

export default TaskEntry;