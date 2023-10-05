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
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
          date,
          exercise,
          sets,
          reps,
          weight,
        };
        onFormSubmit(formData);
        
        const response = await fetch("/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
    }

    return (
        <div className="container" style={{width:"35%"}}>
            <form onSubmit={handleSubmit}>
                <FormInput type = "date" name="Date" onChange={handleDateChange} />
                <FormInput type = "text" name="Exercise" onChange={handleExerciseChange}/>
                <FormInput type = "text" name="Sets" onChange={handleSetsChange}/>
                <FormInput type = "text" name="Reps" onChange={handleRepsChange}/>
                <FormInput type = "text" name="Weight" onChange={handleWeightChange}/>
                <div className="mb-3">
                    <button className="w-100 text-white btn shadow-none py-3" id="submit">Submit</button>
                </div>
            </form>
        </div>
    );
  }
  
  export default Form;