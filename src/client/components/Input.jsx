import { useState } from "react";
// import "./index.css";
import "/src/client/App.css";


function Input() {

    return (
        <div>
            <input type="text"id="name" placeholder="enter cat name..." />
            <input type="text" id="age" placeholder="enter cat age (in years)..." />
            <input type="text" id="breed" placeholder="enter cat breed..." />
            <input type="text" id="favAct" placeholder="enter favorite activity..." />
            

        </div>



    );

}

export default Input

