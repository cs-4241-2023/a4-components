import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  const handleIncreaseCount = () => {
    setCount(count + 1);
  };

  const handleResetCount = () => {
    setCount(0);
  };

  const handleDecreaseCount = () => {
    setCount(count - 1);
  };

  return (
    <>
      <h1>Test Counter</h1>
      <h2>count: {count}</h2>
      <button onClick={handleIncreaseCount}>Increase Count</button>
      <button onClick={handleResetCount}>Reset Count</button>
      <button onClick={handleDecreaseCount}>Decrease Count</button>
    </>
  );
}

export default App;
