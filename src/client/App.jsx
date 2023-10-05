import { useState, useEffect } from "react";
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/light.css"></link>
import "./App.css";
import Input from "./components/Input";
import Table from "./components/Table";


function App() {

  const [serverData, setData] = useState([]);

  useEffect(() => {
  fetch("/fetchData", {
    method: "GET",
  })
    .then((response) => response.json())
    .then(function (json) {  
      setData(json[0])
    })}, [])
    
  const handleFormSubmit = (formData) => {
    const updatedData = [...serverData, formData];
    setData(updatedData);
  };

  const handleDelete = () => {
    table.deleteRow(1);
  }
  

  return (
    <div className="App">
      <h1>Kitty Collector! Keep track of all your favorite cats.</h1>

      <div className="card">
        <Input onSubmit={handleFormSubmit}/>
        <button onClick={() => handleDelete()}>
          Delete
        </button>

        <Table id = "table" props={serverData} data={serverData}/>


      </div>
    </div>
  );
}

export default App;
