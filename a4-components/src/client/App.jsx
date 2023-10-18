import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

function App() { // This works locally.
  const [count, setCount] = useState(0);

  return (
    <>
  <style

  />
  <title>Shows to Watch (CS4241 Assignment 2)</title>
  <meta charSet="utf-8" />
  <link rel="stylesheet" href="css/main.css" />
  <link
    href="https://fonts.googleapis.com/css2?family=Josefin+Sans&display=swap"
    rel="stylesheet"
  />
  {/* get rid of favicon error */}
  <link rel="icon" href="data:;base64,iVBORw0KGgo=" />
  {/* Banner + Title Stuff */}
  <h1 className="header1">TV Watchlist</h1>
  {/* grid stuff */}
  <div className="grid-container">
    <div className="grid-item" id="name">
      {/* Show Name Input */}
      <label htmlFor="showName">Name of Show/Movie</label>
      <input type="text" id="showName" defaultValue="" />
    </div>
    <div className="grid-item" id="year">
      {/* Year of Release Input */}
      <label htmlFor="relYear">Year Of Release</label>
      <input type="text" id="relYear" defaultValue="" />
    </div>
    <div className="grid-item" id="genre">
      {/* Genre Input + Submit */}
      <label htmlFor="genre">Genre</label>
      <input type="text" id="showGenre" defaultValue="" />
      <button id="submit">Submit</button>
    </div>
    <div className="grid-item" id="results">
      {/* Results Table */}
      <label htmlFor="showsTable">Shows and Movies</label>
      <table id="showsTable" border={2}>
        <thead className="thead">
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Year of Release</th>
            <th scope="col">Genre</th>
            <th scope="col">Relevance</th>
            <th scope="col">Edit/Delete</th>
          </tr>
        </thead>
        <tbody id="tableBody"></tbody>
      </table>
    </div>
  </div>
  <form></form>
</>

  );
}

export default App;
