import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import './App.css'
import Title from './components/Title';
import Form from './components/Form';
import Table from './components/Table';

function App() {
  
  return (
    <div>
      <Title name = "Log Your Workout"/>
      <Form />
      <Title name = "Past Workout Logs"/>
      <Table />
    </div>
  );
}

export default App;
