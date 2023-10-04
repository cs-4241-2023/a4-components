export default function Sidebar(props) {
    const { currentTask, setCurrentTask, tasksList, setTasksList } = props;

    const taskElements = tasksList.map((task) => (
        <div
            key={task._id}
            onClick={e => changeTask(e)}
            id={task._id}
            className={`tasks-list--task ${
                task._id === currentTask._id ? "selected" : ""
            } `}
        >
            {task.title}
        </div>
    ));

    const addTaskButton = <div onClick={addTask} className="tasks-list--task">Add a new task!</div>

    return (
        <div className="tasks-list--sidebar">
            <div className="tasks-list--container" id="sidebar">
                {taskElements}
                {addTaskButton}
            </div>
        </div>
    );

    // on click event handler when a task on the sidebar is clicked
    function changeTask(e) {
        const taskFound = tasksList.filter(task => {
            if (task._id === e.target.id) {
                return task
            }
        })[0]
        setCurrentTask(taskFound)
    }

    async function addTask() {
        await fetch("/new", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          })
            .then((response) => response.json())
            .then((json) => {
                setTasksList(json)
                setCurrentTask(json.at(-1))
            });
    }
}
