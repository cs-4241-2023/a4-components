import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import './App.css'
import Title from './components/Title';
import Form from './components/Form';
import Table from './components/Table';

function App() {
  const [serverData, setData] = useState([]);

  useEffect(() => {
  fetch("/fetchData", {
    method: "GET",
  })
    .then((response) => response.json())
    .then(function (json) {  
      setData(json[0].workoutdata)
    })}, [])
    
  const handleFormSubmit = (formData) => {
    const updatedData = [...serverData, formData];
    setData(updatedData);
  };

  const handleDelete = async (index) => {
    const updatedData = serverData.filter((_, i) => i !== index);
    setData(updatedData);

    const json = { deleteResponse:index }

    const response = await fetch("/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json),
  });
  }

  return (
    <div>
      <Title name = "Log Your Workout"/>
      <Form onFormSubmit={handleFormSubmit}/>
      <Title name = "Past Workout Logs"/>
      <Table props = {serverData} deleteLog={handleDelete}/>
    </div>
  );
}

export default App;
