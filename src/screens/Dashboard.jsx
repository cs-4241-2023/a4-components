import Sidebar from "../components/Sidebar";
import Editor from "../components/Editor";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const [tasksList, setTasksList] = useState([]);
    const [currentTask, setCurrentTask] = useState({});

    // Want to fetch data once when we initialize the app
    useEffect(() => {
        // Make this run only on mount (currently unsure if this will run after a log-out)
        async function fetchData() {
            await fetch("/init", {
                method: "GET",
            })
                .then((response) => response.json())
                .then((json) => setTasksList(json));
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (tasksList.length > 0) {
            setCurrentTask(tasksList[0]);
        }
    }, []);

    return (
        <main>
            <Sidebar
                tasksList={tasksList}
                setTasksList={setTasksList}
                currentTask={currentTask}
                setCurrentTask={setCurrentTask}
            />
            <Editor
                tasksList={tasksList}
                setTasksList={setTasksList}
                currentTask={currentTask}
            />
        </main>
    );
}
