import React, { useState } from 'react'
import './App.css'


function App() {

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

        console.log(response.result)
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
            </>
        );
}
export default App
