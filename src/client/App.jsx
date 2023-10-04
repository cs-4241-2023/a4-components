import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import './App.css'
import Title from './components/Title';
import Form from './components/Form';
import Table from './components/Table';

function App() {
  const [date, setDate] = useState('');
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState(0);
  const [reps, setReps] = useState(0);
  const [weight, setWeight] = useState(0);
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

  return (
    <div>
      <Title name = "Log Your Workout"/>
      <Form />
      <Title name = "Past Workout Logs"/>
      <Table props = {serverData}/>
    </div>
  );
}

export default App;
