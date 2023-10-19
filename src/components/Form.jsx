import React from "react";
import { useState } from "react";

function Form({ addTask }) {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [taskPriority, setTaskPriority] = useState("low");

  const formValidation = () => {
    if (taskName.replace(/\s+/g, "") === "") {
      alert("Please enter a task name.");
      return false;
    } else if (taskDescription.replace(/\s+/g, "") === "") {
      alert("Please enter a task description.");
      return false;
    } else if (taskDeadline === "") {
      alert("Please select a task deadline.");
      return false;
    } else if (taskPriority === "") {
      alert("Please select a task priority.");
      return false;
    } else {
      // otherwise validation is successful
      return true;
    }
  };

  const resetForm = () => {
    setTaskName("");
    setTaskDescription("");
    setTaskDeadline("");
    setTaskPriority("low");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formValidation()) {
      // do not submit form if validation fails
      return;
    }

    const newTask = {
      taskName,
      taskDescription,
      taskDeadline,
      taskPriority,
    };

    addTask(newTask);
    resetForm();
  };

  return (
    <>
      <form id="addTaskForm" onSubmit={handleSubmit}>
        {/* Name of the task */}
        <label htmlFor="taskName">Name of your task: </label>
        <br />
        <input
          type="text"
          id="taskName"
          name="taskName"
          size={50}
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          required
        />
        <br />
        <br />
        {/* <!-- Description of the task --> */}
        <label htmlFor="taskDescription">Description of your task: </label>
        <br />
        <textarea
          id="taskDescription"
          name="taskDescription"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          required
        ></textarea>
        <br />
        <br />
        {/* <!-- Due date of the task --> */}
        <label htmlFor="taskDeadline">Select Deadline: </label>
        <input
          type="date"
          id="taskDeadline"
          name="taskDeadline"
          value={taskDeadline}
          onChange={(e) => setTaskDeadline(e.target.value)}
          required
        />
        <br />
        <br />
        {/* <!-- Priority of the task --> */}
        <label htmlFor="taskPriority">Select Priority: </label>
        <select
          id="taskPriority"
          name="taskPriority"
          value={taskPriority}
          onChange={(e) => setTaskPriority(e.target.value)}
          required
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <br />
        <br />
        {/* Submit button */}
        <button
          id="addTaskFormSubmitBtn"
          type="submit"
          form="addTaskForm"
          value="Submit"
          onClick={handleSubmit}
        >
          Add Task
        </button>
      </form>
    </>
  );
}

export default Form;
