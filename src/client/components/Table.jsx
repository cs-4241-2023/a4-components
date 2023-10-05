import 'bootstrap/dist/css/bootstrap.min.css';
import '/src/client/App.css'

function Table({props, deleteLog}) {
    
    const handleDelete = (index) => {
        deleteLog(index);
    }

    return (
    <div className="container justify-content-center d-flex">
    <table className="justify-content-center mb-5">
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
            {props.map((row, index) => (
                <tr key={index}>
                    <td>{row.date}</td>
                    <td>{row.exercise}</td>
                    <td>{row.sets}</td>
                    <td>{row.reps}</td>
                    <td>{row.weight}</td>
                    <td><button onClick={() => handleDelete(index)}>Delete</button></td>
                </tr>
            ))}
        </tbody>
    </table>
    </div>
    );
  }
  
  export default Table;