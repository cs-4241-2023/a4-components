// src/pages/auth/auth.tsx
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import TaskCard from '../../components/dashboard/TaskCard';
import axios from 'axios';
import Masonry from 'react-masonry-css';

import "../../styles/dashboard.css"
import { useNavigate } from 'react-router-dom';
import { Task } from '../../types/dashboard.types';
import { User } from '../../types/auth.types';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        axios.get('/user-info')
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error("Failed to fetch user info:", error);
                navigate("/");
            });
    }, []);

    useEffect(() => {
        axios.get('/user-tasks')
            .then(response => {
                setTasks(response.data);
            })
            .catch(error => {
                console.error("Failed to fetch tasks:", error);
            });
    }, []);

    let defaultColumns = tasks.length + 1;
    if (defaultColumns > 4) defaultColumns = 4;
    const breakpointColumnsObj = {
        default: defaultColumns,  // number of columns for largest breakpoint
        1100: 3,
        700: 2,
        500: 1      // only one column when viewport <= 500px
    };

    const handleAddTask = async () => {
        const response = await axios.post('/tasks', {
            title: '',
            details: '',
            subTasks: [{ title: '', completed: false }]
        });

        // Add the new task to the local tasks list
        const newTask = response.data;
        setTasks(prevTasks => [...prevTasks, newTask]);
    }

    const handleUpdateTask = async (taskId: string, updatedTaskData: any) => {
        try {
            const response = await axios.put(`/task/${taskId}`, updatedTaskData);

            // If the update is successful, update the local state
            if (response.status === 200) {
                setTasks(prevTasks => {
                    return prevTasks.map(task => {
                        if (task._id === taskId) {
                            return { ...task, ...updatedTaskData };  // merge updated data with existing task data
                        }
                        return task;
                    });
                });
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    }

    const handleDeleteTask = (taskId: string) => {
        axios.delete(`/task/${taskId}`)
            .then(_ => {
                // After successfully deleting from the backend, remove from the state
                setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
            })
            .catch(error => {
                console.error("Failed to delete task:", error);
                // Optional: Show an error message to the user, if desired.
            });
    };

    return (
        <>
            <Header />
            <div className="dashboard-container" >
                {user && <h1>{user.username}s' todo tasks:</h1>}
                {!user && <h1>todo tasks:</h1>}

                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                >
                    {tasks.map(task => (
                        <TaskCard
                            key={task._id}
                            task={task}
                            onTaskDelete={() =>
                                handleDeleteTask(task._id)}
                            onTaskUpdate={(updatedTaskData) =>
                                handleUpdateTask(task._id, updatedTaskData)}
                        />
                    ))}
                    <div className="add-task-button">
                        <button onClick={handleAddTask} title='Add New Task'>Add New Task</button>
                    </div>
                </Masonry>
            </div>
        </>
    );
};

export default Dashboard;
