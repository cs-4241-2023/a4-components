import React from "react";

function Main() {
  return (
    <>
      <main>
        <h2>Add tasks to your todo list: </h2>
        <form id="addTaskForm">
          {/* Name of the task */}
          <label htmlFor="taskName">Name of your task: </label>
          <br />
          <input type="text" id="taskName" name="taskName" size={50} />
          <br />
          <br />
          {/* <!-- Description of the task --> */}
          <label htmlFor="taskDescription">Description of your task: </label>
          <br />
          <textarea id="taskDescription" name="taskDescription"></textarea>
          <br />
          <br />
          {/* <!-- Due date of the task --> */}
          <label htmlFor="taskDeadline">Select Deadline: </label>
          <input type="date" id="taskDeadline" name="taskDeadline" />
          <br />
          <br />
          {/* <!-- Priority of the task --> */}
          <label htmlFor="taskPriority">Select Priority: </label>
          <select id="taskPriority" name="taskPriority">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <br />
          <br />
          {/* <!-- Submit button --> */}
          <button
            id="addTaskFormSubmitBtn"
            type="submit"
            form="addTaskForm"
            value="Submit"
          >
            Add Task
          </button>
          {/* <!-- <button>submit</button> --> */}
        </form>
        {/* table of results below */}
        <h2>Tasks currently in your todo list: </h2>
        <table id="tasksTable">
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Task Description</th>
              <th>Task Created Date</th>
              <th>Task Deadline</th>
              <th>Task Priority</th>
              <th>Total Time Alloted</th>
              <th>Time Remaining</th>
              <th>Delete?</th>
            </tr>
          </thead>
        </table>
      </main>
    </>
  );
}

export default Main;
