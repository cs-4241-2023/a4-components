import React from "react";
import { useState } from "react";

// Import the Home page component
import Home from "./pages/home.jsx";

// Import and apply CSS stylesheet
import "./styles/styles.css";

export default function App() {
  const [formData, setFormData] = useState({
    priority: "",
    name: "",
    email: "",
    asnmt: "",
    date: "",
    msg: "",
    id: "",
  });

  const [formArr, setFormArr] = useState([]);
  const [mod, setMod] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  let { name, email, asnmt, date, msg, index } = formData;

  function changeHandle() {
    setFormArr([...formArr, { name, email, asnmt, date, msg }]);
    console.log(formArr);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleDelete = (delInfo) => {
    const newData = formArr.filter((info) => info !== delInfo);
    console.log("new list : " + newData);
    setFormArr(newData);
  };

  const handleMod = (index) => {
    let { name, email, asnmt, date, msg } = formArr[index];
    setFormData({ name, email, asnmt, date, msg, index });
    setMod(true);
  };

  const updateInfo = () => {
    console.log({ name, email, asnmt, date, msg, index });
    let modArr = [...formArr];
    modArr.map((info, ind) => {
      if (ind === index) {
        modArr[index] = { name, email, asnmt, date, msg, index };
        console.log(modArr[ind]);
      }
    });
    setFormArr(modArr);
  };

  const handleSort = (sortAll) => {
    const newFormArr = [];
    for (let i = 0; i < sortAll.length; i++) {
      if (calculatePriority(sortAll[i]) === "High") {
        newFormArr.push(sortAll[i]);
      }
    }
    for (let i = 0; i < sortAll.length; i++) {
      if (calculatePriority(sortAll[i]) === "Medium") {
        newFormArr.push(sortAll[i]);
      }
    }
    for (let i = 0; i < sortAll.length; i++) {
      if (calculatePriority(sortAll[i]) === "Low") {
        newFormArr.push(sortAll[i]);
      }
    }

    setFormArr(newFormArr);
  };

  const calculatePriority = (data) => {
    if (data.msg === "" || data.date > 10) {
      return "Low";
    } else if (data.date < 10 && data.date >= 5) {
      return "Medium";
    } else {
      return "High";
    }
  };

  return (
    <div class="container">
      <form onSubmit={handleSubmit}>
        <h1>Request for Extension</h1>
        <div class="container">
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div class="container">
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div class="container">
          <label htmlFor="asnmt">Assignment:</label>
          <input
            type="text"
            id="asnmt"
            name="asnmt"
            value={formData.asnmt}
            onChange={handleChange}
            required
          />
        </div>
        <div class="container">
          <label htmlFor="date">Days Until Due: </label>
          <input
            type="text"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div class="container">
          <label htmlFor="msg">Reason For Extension: </label>
          <textarea
            id="msg"
            name="msg"
            value={formData.msg}
            onChange={handleChange}
          />
        </div>

        <div class="container">
          <button onClick={!mod ? changeHandle : updateInfo} type="submit">
            Submit
          </button>
        </div>
      </form>
      <button id="sortButton" onClick={() => handleSort(formArr)}>Sort By Priority</button>

      <table border={1} width="30%" cellPadding={10}>
        <tbody>
          <tr>
            <td>Priority: </td>
            <td>Name: </td>
            <td>Email: </td>
            <td>Assignment: </td>
            <td>Days Until Due: </td>
            <td>Reason: </td>
            <td>Actions: </td>
          </tr>
          {formArr.map((info, ind) => {
            return (
              <tr key={ind}>
                <td>{calculatePriority(info)}</td>
                <td>{info.name}</td>
                <td>{info.email}</td>
                <td>{info.asnmt}</td>
                <td>{info.date}</td>
                <td>{info.msg}</td>
                <td>
                  <button onClick={() => handleDelete(info)}>Delete</button>
                </td>
                <td>
                  <button onClick={() => handleMod(ind)}>Modify</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
