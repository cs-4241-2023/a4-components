import React from "react";
import ReactDOM from "react-dom";
import App from "./app.jsx";

const DATA = [
  { id: "plant-0", name: "Pothos", watered: true },
  { id: "plant-1", name: "Bird of paradise", watered: false },
  { id: "plant-2", name: "Air plant", watered: false },
];

ReactDOM.render(
  <React.StrictMode>
    <App plants = {DATA} />
  </React.StrictMode>,
  document.getElementById("root")
);
