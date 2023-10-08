import "./style.css";

import { setupCounter } from "./counter.js";
import javascriptLogo from "./javascript.svg";

document.querySelector("#bod").innerHTML = `
<form>
<table id="itemt">
  <tr>
    <td>
      <label>Email:</label>
      <input
        type="email"
        id="Email"
        placeholder="your email here"
        required
      />
    </td>
  </tr>

  <tr>
    <td>
      <label>Name:</label>
      <input
        type="text"
        id="Name"
        placeholder="your full name here"
        required
      />
    </td>
  </tr>

  <tr>
    <td>
      <label>Birth date:</label>
      <input type="date" id="Birth" placeholder="select date" required />
    </td>
  </tr>
</table>
</form>
<div id="btn">
<button id="submit">Submit</button>
<button id="display">Display info</button>
<button id="edit"> Edit submit</button>
<button id="delete">Delete</button>
<button id="clear">Clear</button>
</div>
<p id="fade">Submission Successful</p>
<p id="dell">Deletion Successful: clear the table</p>
<p id="uD">Table has been updated</p>

<table id="data"></table>
`;

setupCounter(document.querySelector("#counter"));
