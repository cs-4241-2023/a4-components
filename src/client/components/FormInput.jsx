import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import '/src/client/App.css'

function FormInput({type, name, onChange}) {
    return (
    <div className="form-floating mb-3">
        <input type={type} className="justify-content-center align-items-center d-flex form-control" id={name} placeholder={name} onChange={onChange}/>
        <label htmlFor={name} className="form-label">{name}</label>
    </div>
    );
  }
  
  export default FormInput;