import { useState } from "react";
// import "./index.css";
import "/src/client/App.css";


function Input({onSubmit}) {

    const [name, setName] = useState('');
    const [age, setAge] = useState(0);
    const [breed, setBreed] = useState('');
    const [favAct, setFavAct] = useState('');

    const handleNameChange = (e) => {
        setName(e.target.value);
    };
    
    const handleAgeChange = (e) => {
    setAge(e.target.value);
    };
    
    const handleBreedChange = (e) => {
    setBreed(e.target.value);
    };
    
    const handleFavActChange = (e) => {
    setFavAct(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
          name,
          age,
          breed,
          favAct,
        };
        onSubmit(formData);

        const response = await fetch("/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
    }


    return (
        <div>
            <form onSubmit = {handleSubmit}>
            <input type="text"id="name" placeholder="enter cat name..." onChange={handleNameChange}/>
            <input type="text" id="age" placeholder="enter cat age (in years)..." onChange={handleAgeChange}/>
            <input type="text" id="breed" placeholder="enter cat breed..." onChange={handleBreedChange}/>
            <input type="text" id="favAct" placeholder="enter favorite activity..." onChange={handleFavActChange}/>

            <button>
                Submit
            </button>

            </form>



        
        </div>

        



    );

}

export default Input

