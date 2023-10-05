import { useState } from "react";
// import "./index.css";
import "/src/client/App.css";


function Table(props) {

    return (
        <div>

            <table className="center" id="table">
                <thead>

                    <tr>
                        <th> Name</th>
                        <th>Cat Age</th>
                        <th>Cat Breed</th>
                        <th>Favorite Activity</th>


                    </tr>


                </thead>

                <tbody>

                {props.data.map((row, index) => (
                <tr key={index}>
                    <td>{row.name}</td>
                    <td>{row.age}</td>
                    <td>{row.breed}</td>
                    <td>{row.favAct}</td>
                </tr>
                ))}
                </tbody>
            </table>
        </div>
    );

}

export default Table;

