import 'bootstrap/dist/css/bootstrap.min.css';
import '/src/client/App.css'
import FormInput from "./FormInput"; 
import { useState} from "react";

function Form({ onFormSubmit }) {
    const [date, setDate] = useState('');
    const [exercise, setExercise] = useState('');
    const [sets, setSets] = useState(0);
    const [reps, setReps] = useState(0);
    const [weight, setWeight] = useState(0);

    const handleDateChange = (e) => {
        setDate(e.target.value);
    };
    
    const handleExerciseChange = (e) => {
    setExercise(e.target.value);
    };
    
    const handleSetsChange = (e) => {
    setSets(parseInt(e.target.value));
    };
    
    const handleRepsChange = (e) => {
    setReps(parseInt(e.target.value));
    };

    const handleWeightChange = (e) => {
    setWeight(parseFloat(e.target.value));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
          date,
          exercise,
          sets,
          reps,
          weight,
        };
        onFormSubmit(formData);
    }

    return (
        <div className="container" style={{width:"35%"}}>
            <form onSubmit={handleSubmit}>
                <FormInput type = "date" name="Date" value={date} onChange={handleDateChange} />
                <FormInput type = "text" name="Excercise" value={exercise} onChange={handleExerciseChange}/>
                <FormInput type = "text" name="Sets" value={sets} onChange={handleSetsChange}/>
                <FormInput type = "text" name="Reps" value={reps} onChange={handleRepsChange}/>
                <FormInput type = "text" name="Weight" value={weight} onChange={handleWeightChange}/>
                <div className="mb-3">
                    <button className="w-100 text-white btn shadow-none py-3" id="submit">Submit</button>
                </div>
            </form>
        </div>
    );
  }
  
  export default Form;