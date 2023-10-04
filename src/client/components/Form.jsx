import 'bootstrap/dist/css/bootstrap.min.css';
import '/src/client/App.css'
import FormInput from "./FormInput"; 

function Form() {
    return (
        <div className="container" style={{width:"35%"}}>
            <FormInput type = "date" name = "Date"/>
            <FormInput type = "text" name = "Exercise"/>
            <FormInput type = "text" name = "Sets"/>
            <FormInput type = "text" name = "Reps"/>
            <FormInput type = "text" name = "Weight"/>
            <div className="mb-3">
                <button className="w-100 text-white btn shadow-none py-3" id="submit">Submit</button>
            </div>
        </div>
    );
  }
  
  export default Form;