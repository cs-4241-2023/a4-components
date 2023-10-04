import React, { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { Task, TaskMode, TaskStatus } from "../../types/dashboard.types"
import AddTaskIcon from '@mui/icons-material/AddTask';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';

import "../../styles/task_card.css"
import ProgressBar from './ProgressBar';
import SubTask from './SubTask';

type TaskCardProps = {
    task: Task;
    onTaskDelete: (taskId: string) => void;
    onTaskUpdate: (taskId: string, updatedTask: any) => void;
};


const TaskCard: React.FC<TaskCardProps> = ({ task, onTaskDelete, onTaskUpdate }) => {
    console.log("Is onTaskUpdate defined?", !!onTaskUpdate);

    const [mode, setMode] = useState(task.title ? TaskMode.SHOW : TaskMode.EDIT)
    const [title, setTitle] = useState(task.title);
    const [details, setDetails] = useState(task.details);
    const [subTasks, setSubTasks] = useState(task.subTasks);

    const completedSubTasks = subTasks.filter(subTask => subTask.completed).length;
    const progress = (completedSubTasks / subTasks.length) * 100;

    let status = TaskStatus.NOT_STARTED;
    if (progress === 100) status = TaskStatus.COMPLETE;
    else if (progress > 0) status = TaskStatus.IN_PROGRESS;


    const toggleSubTaskCompletion = (index: number) => {
        const newSubTasks = [...subTasks];
        newSubTasks[index].completed = !newSubTasks[index].completed;

        setSubTasks(newSubTasks);
        onTaskUpdate(task._id, { subTasks: newSubTasks });
    };

    const setSubTaskTitle = (index: number, title: string) => {
        const newSubTasks = [...subTasks];
        newSubTasks[index].title = title;
        setSubTasks(newSubTasks);
        onTaskUpdate(task._id, { subTasks: newSubTasks });
    };

    const addSubTask = () => {
        const newSubTasks = [...subTasks, { title: "", completed: false }];
        setSubTasks(newSubTasks);
        onTaskUpdate(task._id, { subTasks: newSubTasks });
    }

    const deleteSubTask = (index: number) => {
        const newSubTasks = [...subTasks];
        newSubTasks.splice(index, 1)
        setSubTasks(newSubTasks);
        onTaskUpdate(task._id, { subTasks: newSubTasks });
    }

    const deleteTask = () => {
        onTaskDelete(task._id);
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);

        // Update task in the database
        onTaskUpdate(task._id, { title: newTitle })
    };

    const handleDetailChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newDetail = e.target.value;
        setDetails(newDetail);

        // Update task in the database
        console.log("updating detail", newDetail)
        onTaskUpdate(task._id, { detail: newDetail });
    };

    return (
        <div className={`task-card ${mode}`}>
            <div className="task-header">
                {mode === TaskMode.SHOW ? <h2>{title}</h2> : <input type="text" value={title} onChange={(e) => handleTitleChange(e)} placeholder="Title" />}
                {mode === TaskMode.SHOW ? <p>{details}</p> : <textarea value={details} onChange={(e) => handleDetailChange(e)} placeholder='Details' />}
            </div>
            <hr />
            <div className="task-progress">
                <div className='task-status'>
                    <div>
                        <h2>Task Progress</h2>
                    </div>
                    <div className='task-status-current'>
                        <h3>{status}</h3>
                    </div>
                </div>
                <ProgressBar progress={progress} />
            </div>
            <hr />
            <div className='task-subtasks'>
                <h2>SUB-TASKS: {subTasks.length}</h2>
                <div className='subtask-container'>
                    {subTasks.map((task, index) => (
                        <SubTask
                            mode={mode}
                            title={task.title}
                            setTitle={(e) => setSubTaskTitle(index, e)}
                            isComplete={task.completed}
                            toggleIsComplete={() => toggleSubTaskCompletion(index)}
                            delete={() => deleteSubTask(index)}
                        />
                    ))}
                    {mode === TaskMode.SHOW ? null :
                        <button className='subtask-add-button' onClick={() => addSubTask()}>
                            <AddTaskIcon />
                        </button>
                    }
                </div>
            </div>
            <hr />
            <div className='task-footer'>
                <button onClick={() => deleteTask()}>
                    <HighlightOffTwoToneIcon />
                </button>
                <button onClick={() => setMode(mode === TaskMode.SHOW ? TaskMode.EDIT : TaskMode.SHOW)}>
                    <EditIcon />
                </button>
                {/* <button onClick={() => { () => toggleComplete() }}>
                    <CheckCircleTwoToneIcon />
                </button> */}
            </div>
        </div>
    )
}

export default TaskCard;
