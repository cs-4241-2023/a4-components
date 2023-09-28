import React from 'react'
import './App.css'


function App() {
    const [assignmentData, setAssignmentData] = React.useState([]);
    const [dataChanged, setDataChanged] = React.useState(false);

    React.useEffect( () =>{
        async function getData() {
            return await (await fetch("/get-assignments", { method: "GET"})).json();
        }

        getData().then(data => {

            const rows = [];

            data.forEach(assignment => {
                const row = (
                    <tr key={rows.length}>
                        <td>{assignment.className}</td>
                        <td>{assignment.assignmentName}</td>
                        <td>{assignment.dueDate}</td>
                        <td>{assignment.difficulty}</td>
                        <td>{assignment.priority}</td>
                        <td><button type={"submit"} onClick={(e) => editAssignment(e, assignment)}>Edit</button></td>
                        <td><button className={"delete-button"} onClick={(e) => deleteAssignment(e, assignment)}>Delete</button></td>
                    </tr>
                );
                rows.push(row);
            });
            setAssignmentData(rows);
            setDataChanged(false);
        })
    }, [dataChanged]);

    async function submitAssignment(e) {
        e.preventDefault();

        let form = e.target.elements;

        let assignment = {
            className: form.className.value,
            assignmentName: form.assignmentName.value,
            dueDate: form.dueDate.value,
            difficulty: form.difficulty.value,
            priority: ""
        }

        let response = await (await fetch("/submit-assignment", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(assignment)
        })).json();

        setDataChanged(true);
    }

    async function editAssignment(e, assignment) {
        e.preventDefault();

        let response = await (await fetch("/edit-assignment", {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(assignment)
        })).json();


        setDataChanged(true);
    }

    async function deleteAssignment(e, assignment) {
        e.preventDefault();

        let response = await (await fetch("/delete-assignment", {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(assignment)
        })).json();

        setDataChanged(true);
    }

        return (
            <>
                <header>
                    <h1>WPI School Work Tracker</h1>
                    <p>
                        This application allows you to track assignments for your WPI classes. Please input information about the assignment
                        below and this web application will store it for you! The application will also calculate a relative priority for the
                        assignment based on the difficulty and due date of the inputted assignment.
                    </p>
                </header>

                <form name={"assignment-form"} autoComplete={"off"} onSubmit={submitAssignment}>
                    <input name={"className"} placeholder={"Class Name"}/>
                    <input name={"assignmentName"} placeholder={"Assignment Name"}/>
                    <input type={"date"} name={"dueDate"} />
                    <input type={"number"} name={"difficulty"} placeholder={"Difficulty (1 to 10)"}/>
                    <button type={"submit"}>Submit</button>
                </form>
                <h2>Tracked Assignments Stored on Node.js Server</h2>
                <table>
                    <thead>
                    <tr>
                        <th>Class</th>
                        <th>Assignment Name</th>
                        <th>Due Date</th>
                        <th>Difficulty</th>
                        <th>Priority</th>
                    </tr>
                    </thead>
                    <tbody>
                        {assignmentData}
                    </tbody>
                </table>
            </>
        );
}

export default App
