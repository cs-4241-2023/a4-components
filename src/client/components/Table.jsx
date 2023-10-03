import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import '/src/client/App.css'

function Table({name}) {
    return (
    <table className="justify-content-center d-flex mb-5">
        <thead>
            <tr className="text-white h4 text-left">
                <th>Date</th>
                <th>Exercise</th>
                <th>Sets</th>
                <th>Reps</th>
                <th>Weight</th>
                <th>Delete</th>
            </tr>   
        </thead>
        <tbody>
        </tbody>
    </table>
    );
  }
  
  export default Table;