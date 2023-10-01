import React, { useState, useRef, useEffect } from "react";
import Form from "./pages/Form.jsx";
import FilterButton from "./pages/FilterButton.jsx";
import Tracker from "./pages/Tracker.jsx";
import { nanoid } from "nanoid";

// Import and apply CSS stylesheet
import "./styles/sakura.css";
import "./styles/styles.css";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const FILTER_MAP = {
  All: () => true,
  Unwatered: (plant) => !plant.watered,
  Watered: (plant) => plant.watered,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
  const [plants, setPlants] = useState(props.plants);
  const [filter, setFilter] = useState("All");

  function togglePlantWatered(id) {
    const updatedPlants = plants.map((plant) => {
      if (id === plant.id) {
        return { ...plant, watered: !plant.watered };
      }
      return plant;
    });
    setPlants(updatedPlants);
  }

  function deletePlant(id) {
    const remainingPlants = plants.filter((plant) => id !== plant.id);
    setPlants(remainingPlants);
  }

  function editPlant(id, newName) {
    const editedPlantList = plants.map((plant) => {
      if (id === plant.id) {
        return { ...plant, name: newName };
      }
      return plant;
    });
    setPlants(editedPlantList);
  }

  const plantList = plants
    .filter(FILTER_MAP[filter])
    .map((plant) => (
      <Tracker
        id={plant.id}
        name={plant.name}
        watered={plant.watered}
        key={plant.id}
        togglePlantWatered={togglePlantWatered}
        deletePlant={deletePlant}
        editPlant={editPlant}
      />
    ));

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  function addPlant(name) {
    const newPlant = { id: "plant-" + nanoid(), name: name, watered: false };
    setPlants([...plants, newPlant]);
  }

  const plantsNoun = plantList.length !== 1 ? "Plants" : "Plant";
  const headingText = `${plantList.length} ${plantsNoun} in Your Home Garden`;

  const listHeadingRef = useRef(null);
  const prevPlantLength = usePrevious(plants.length);

  useEffect(() => {
    if (plants.length - prevPlantLength === -1) {
      listHeadingRef.current.focus();
    }
  }, [plants.length, prevPlantLength]);

  return (
    <div className="todoapp stack-large">
      <Form addPlant={addPlant} />
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {headingText}
      </h2>
      <div className="filters btn-group stack-exception">{filterList}</div>
      <ul
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {plantList}
      </ul>
    </div>
  );
}

export default App;
