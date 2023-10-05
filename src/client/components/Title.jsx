import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import '/src/client/App.css'

function Title({name}) {
    return (
      <div className="justify-content-center d-flex">
        <h1 className="m-5 fw-bold text-white">{name}</h1>
      </div>
    );
  }
  
  export default Title;