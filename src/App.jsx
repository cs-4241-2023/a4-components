import { useState } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import "./css/main.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div id="flex-container">
        <Header />
        <Main />
        <Footer />
      </div>
    </>
  );
}

export default App;
