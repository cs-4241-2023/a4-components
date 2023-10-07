import React from "react";
import Form from "./Form";
import ResultsTable from "./ResultsTable";

function Main({ listOfTasks }) {
  return (
    <>
      <main>
        <h2>Add tasks to your todo list: </h2>
        {/* Add Task form below */}
        <Form />
        {/* table of results below */}
        <h2>Tasks currently in your todo list: </h2>
        <ResultsTable listOfTasks={listOfTasks} />
      </main>
    </>
  );
}

export default Main;
