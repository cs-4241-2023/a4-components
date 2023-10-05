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
      console.log(json[0].workoutdata)
      setData(json[0].workoutdata)
    })}, [])
    
  const handleFormSubmit = (formData) => {
    console.log(formData);
    const updatedData = [...serverData, formData];
    setData(updatedData);
    console.log(updatedData)
  };


  return (
    <div>
      <Title name = "Log Your Workout"/>
      <Form onFormSubmit={handleFormSubmit}/>
      <Title name = "Past Workout Logs"/>
      <Table props = {serverData}/>
    </div>
  );
}

export default App;
