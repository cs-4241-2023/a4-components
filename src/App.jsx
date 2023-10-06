import React from 'react'

function App() {
    const [taskData, settaskData] = React.useState([]);
    const [dataChanged, setDataChanged] = React.useState(false);
    const [actionResult, setActionResult] = React.useState(<p></p>);
    const [editWindow, setEditWindow] = React.useState(<></>)

    React.useEffect( () =>{
        async function getData() {
            return await (await fetch("/get-tasks", { method: "GET"})).json();
        }

        getData().then(data => {

            const rows = [];

            data.forEach(task => {
                const row = (
                    <tr key={rows.length}>
                        <td>{task.taskname}</td>
                        <td>{task.duedate}</td>
                        <td><button type={"submit"} onClick={(e) => openEditPopUp(e, task)}>Edit</button></td>
                        <td><button className={"delete-button"} onClick={(e) => deletetask(e, task)}>Delete</button></td>
                    </tr>
                );
                rows.push(row);
            });
            settaskData(rows);
            setDataChanged(false);
        })
    }, [dataChanged]);

    async function submittask(e) {
        e.preventDefault();

        let form = e.target.elements;

        let task = {
            taskname: form.taskname.value,
            duedate: form.duedate.value,
        }

        let response = await (await fetch("/submit-task", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(task)
        })).json();

        if(response.result !== "Failure") {
            form.taskname.value = "";
            form.duedate.value = "";
        }

        setActionResult(parseServerResult(response));
        setDataChanged(true);
    }

    function openEditPopUp(e, task) {
        e.preventDefault();

        let editWindow = (
            <form name={"task-form"} autoComplete={"off"} onSubmit= { async (e) => {
                e.preventDefault();
                await edittask(e, task);
            }}>
                <input name={"taskname"} placeholder={"task Name"} defaultValue={task.taskname}/>
                <input type={"date"} name={"duedate"} defaultValue={task.duedate}/>
                <button className={"delete-button"} onClick={() => setEditWindow(<></>)}>Cancel Edit</button>
                <button type={"submit"}>Submit Edit</button>
            </form>
        )
        setEditWindow(editWindow);
    }

    async function edittask(e, task) {
        let form = e.target.elements;

        let editedtask = {
            _id: task._id,
            taskname: form.taskname.value,
            duedate: form.duedate.value
        }

        await (await fetch("/edit-task", {
             method: "PUT",
             headers: {"Content-Type": "application/json"},
             body: JSON.stringify(editedtask)
        })).json();

        setEditWindow(<></>);
        setDataChanged(true);
    }

    async function deletetask(e, task) {
        e.preventDefault();
        await (await fetch("/delete-task", {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(task)
        })).json();
        setDataChanged(true);
    }

    function parseServerResult(response) {
        let status = response.result + "! " +  response.message;
        let color;

        if(response.result === "Success") {
            color = "green"
        } else {
            color = "red"
        }
        return (<p style={{color: color}}>{status}</p>);
    }

        return (
            <>
                <header>
                    <h1>WDIHTD</h1>
                    <p> What do I have to do?
                    </p>
                </header>

                <form name={"task-form"} autoComplete={"off"} onSubmit={(e) => submittask(e)}>
                    <input name={"taskname"} placeholder={"task Name"}/>
                    <input type={"date"} name={"duedate"} />
                    <button type={"submit"}>Submit</button>
                </form>

                <div>
                    {actionResult}
                </div>

                <h2>Tracked tasks Stored on Node.js Server</h2>
                {editWindow}
                <table>
                    <thead>
                    <tr>
                        <th>task Name</th>
                        <th>Due Date</th>
                    </tr>
                    </thead>
                    <tbody>
                        {taskData}
                    </tbody>
                </table>
            </>
        );
}

export default App