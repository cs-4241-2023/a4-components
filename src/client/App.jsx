import { useState } from "react";
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/light.css"></link>
import "./App.css";
import "./components/Input"
import Input from "./components/Input";
import Table from "./components/Table";


function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <h1>Kitty Collector! Keep track of all your favorite cats.</h1>

      <div className="card">
        <Input />
        <button onClick={() => setCount((count) => count + 1)}>
          Delete
        </button>

        <button onClick={() => setCount((count) => count + 1)}>
          Submit
        </button>
        {/* <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button> */}

        <Table />   


      </div>
    </div>
  );
}

export default App;
