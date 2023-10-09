import { useState } from "react";
import Contacts from "./pages/Contacts";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Contacts />
    </div>
  );
}
export default App;
