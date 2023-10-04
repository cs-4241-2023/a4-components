import { useEffect, useState } from "react";

export default function Editor(props) {
    const { tasksList, setTasksList, currentTask } = props;

    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("Low");
    const [description, setDescription] = useState("");

    function populateForm() {
        if (currentTask) {
            setTitle(currentTask.title);
            setDate(currentTask.date);
            setDueDate(currentTask.dueDate);
            setPriority(currentTask.priority);
            setDescription(currentTask.description);
        }
    }

    // Run this side-effect whenever a different note is selected (might not need to happen because of rerenders?)
    useEffect(() => {
        populateForm();
    }, [currentTask]);

    async function handleSaveNote(e) {
        e.preventDefault();

        const edit = {
            title,
            date,
            dueDate,
            priority,
            description,
            _id: currentTask._id
        }

        await fetch("/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(edit),
        })
            .then((response) => response.json())
            .then((json) => (setTasksList(json)));
    }

    async function handleDeleteNote(e) {
        e.preventDefault();

        await fetch("/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ taskID: currentTask._id }),
        })
            .then((response) => response.json())
            .then((json) => setTasksList(json));
    }

    return (
        <form id="form">
            <div className="task-info--input">
                <label htmlFor="task-title">Title:</label>
                <input
                    name="title"
                    type="text"
                    id="task-title"
                    className="task-title"
                    required={true}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className="task-info--input">
                <label htmlFor="task-date">Date:</label>
                <input
                    name="date"
                    value={date}
                    type="date"
                    id="task-date"
                    className="task-date"
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>
            <div className="task-info--input">
                <label htmlFor="due-date">Due Date</label>
                <input
                    name="due"
                    value={dueDate}
                    type="date"
                    id="due-date"
                    className="task-date"
                    readOnly
                />
            </div>
            <div className="task-info--input">
                <label htmlFor="task-priority">Priority:</label>
                <select
                    name="priority"
                    value={priority}
                    id="task-priority"
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>
            <textarea
                name="description"
                id="task-body"
                cols="30"
                rows="25"
                placeholder="Type task here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <div className="input-buttons">
                <input
                    type="submit"
                    id="save"
                    value="Save Note"
                    onClick={(e) => handleSaveNote(e)}
                />
                <button
                    id="delete-note"
                    type="button"
                    onClick={(e) => handleDeleteNote(e)}
                >
                    Delete Note
                </button>
            </div>
        </form>
    );
}
