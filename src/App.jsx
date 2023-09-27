import React, { useState } from 'react'
import './App.css'


function App() {

    function handleClick(event) {
        event.preventDefault();
        alert("Hello World")
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

                <form id={"assignment-form"} autoComplete={"off"}>
                    <input aria-label={"class-name"} type={"text"} id={"class-name"} placeholder={"Class Name"}/>
                    <input aria-label={"assignment-name"} type={"text"} id={"assignment-name"} placeholder={"Assignment Name"}/>
                    <input aria-label={"due-date"} type={"date"} id={"due-date"} />
                    <input aria-label={"difficulty"} type={"number"} id={"difficulty"} placeholder={"Difficulty (1 to 10)"}/>
                    <label form={"assignment-form"}>Completed? <input aria-label={"completed"} type={"checkbox"} id={"completed"}/></label>
                    <button id={"submit-button"} onClick={handleClick}>Submit</button>
                </form>
            </>
        );
}
export default App
