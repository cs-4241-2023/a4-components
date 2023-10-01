import React, { useState } from "react";

function Form(props) {
  const [name, setName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      return;
    }
    props.addPlant(name);
    setName("");
  }

  function handleChange(e) {
    setName(e.target.value);
  }

  return (
    <form className="new-plant-form" onSubmit={handleSubmit}>
      <h1 className="page-title">Plant Watering Tracker</h1>
      <label htmlFor="new-plant-input" className="label__lg req">
        Add a New Plant
      </label>
      <input
        type="text"
        id="new-plant-input"
        className="input input__lg"
        name="text"
        autoComplete="off"
        placeholder="plant name here"
        value={name}
        onChange={handleChange}
        required
      />
      <button type="submit" className="btn btn__primary btn__lg submit-button">
        Add
      </button>
    </form>
  );
}

export default Form;
