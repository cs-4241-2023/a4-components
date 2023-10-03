import React, { useState, useEffect } from 'react'
import { localTimelineInstance, timelineChangeEvent } from './Timeline.jsx'

const CharacterItem = props => {
  const { _id, name, start, end, era, deleteCharacterItem, modifyCharacterItem } = props;


  return (
    <tr>
      <td>{name}</td>
      <td>{start}</td>
      <td>{end}</td>
      <td>{era}</td>
      <td>
        <button onClick={e => deleteCharacterItem(name, start, end, era)}>X</button>
        <button onClick={e => modifyCharacterItem(_id, name)}>Modify</button>
      </td>

    </tr>


  )
}


const App = () => {
  const [characterItems, setCharacterItems] = useState([])


  async function addCharacterItem() {


    const response = await fetch('/characterData', {
      method: 'GET'
    })

    const data = await response.json();

    const nameInput = document.querySelector('#characterName');
    const startInput = document.querySelector('#characterStart');
    const endInput = document.querySelector('#characterEnd');

    const errorMsg = document.getElementById("characterErrorMessage")


    //name duplicate check preprocessing
    const nameArray = [];

    for (let i = 0; i < data.length; i++) {
      nameArray.push(data[i].name);
    }
    if (nameArray.includes(nameInput.value)) {
      errorMsg.textContent = "Name must be unique"
      errorMsg.style.display = "block";
    } else if (isNaN(startInput.value) || isNaN(endInput.value)) {
      errorMsg.textContent = "Enter a numerical value for birth and death"
      errorMsg.style.display = "block";
    } else {

      document.getElementById("characterErrorMessage").style.display = "none";

      const json = { name: nameInput.value, start: parseInt(startInput.value), end: parseInt(endInput.value), era: "" }, body = JSON.stringify(json)

      const response = await fetch('/characterData', {
        method: 'POST',
        body
      })

      const data = await response.json()

      console.log('text:', data)
      setCharacterItems(data);
    }
  }

  async function deleteCharacterItem(name, start, end, era) {

    const character = await fetch("/characterData", {
      method: "DELETE",
      body: JSON.stringify({ name: name, start: start, end: end, era: era })
    })

    const json = await character.json();
    setCharacterItems(json);
  }

  async function modifyCharacterItem(_id, name) {

    const response = await fetch('/characterData', {
      method: 'GET'
    })

    const data = await response.json();

    const nameInput = document.querySelector('#characterName');
    const startInput = document.querySelector('#characterStart');
    const endInput = document.querySelector('#characterEnd');

    const errorMsg = document.getElementById("characterErrorMessage")

    const nameArray = [];

    for (let i = 0; i < data.length; i++) {
      nameArray.push(data[i].name);
    }


    if (nameArray.includes(nameInput.value) && name != nameInput.value) {
      console.log("uniqueness")
      errorMsg.textContent = "Name must be unique"
      errorMsg.style.display = "block";
    } else if (isNaN(startInput.value) || isNaN(endInput.value)) {
      errorMsg.textContent = "Enter a numerical value for birth and death"
      errorMsg.style.display = "block";
    } else {

      errorMsg.style.display = "none";

      const characterData = await fetch("/modifyCharacterData", {
        method: "POST",
        body: JSON.stringify({ _id: _id, name: nameInput.value, start: parseInt(startInput.value), end: parseInt(endInput.value), era: "" })
      })

      const json = await characterData.json();
      setCharacterItems(json);
    }
  }



  // make sure to only do this once
  if (characterItems.length === 0) {
    fetch('/characterData', {
      method: 'GET'
    })
      .then(response => response.json())
      .then(json => {
        setCharacterItems(json)
      })
  }

  useEffect(() => {
    const handleChange = () => {
      fetch('/characterData', {
        method: 'GET'
      })
        .then(response => response.json())
        .then(json => {
          setCharacterItems(json)
        })
    }

    window.addEventListener('timelineChange', handleChange);

    return () => {
      window.removeEventListener('timelineChange', handleChange);
    }
  }, [])

  return (
    <div>
      <form>
        <div className="label-row">
          <label htmlFor="characterName">Name:</label>
          <input type="text" id="characterName" name="name" />

          <label htmlFor="characterStart">Birth:</label>
          <input type="text" id="characterStart" name="birth" />

          <label htmlFor="characterEnd">Death:</label>
          <input type="text" id="characterEnd" name="death" />


        </div>
      </form>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button onClick={e => addCharacterItem()}>submit</button>
        <label id="characterErrorMessage">Please enter a numerical birth and death</label>
      </div>
      <table className="characterTable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Birth</th>
            <th>Death</th>
            <th>Eras</th>
            <th>Delete/Modify</th>
          </tr>
        </thead>
        <tbody>

          {characterItems.map((characterItem, i) => <CharacterItem key={i}
            _id={characterItem._id}
            name={characterItem.name}
            start={characterItem.start}
            end={characterItem.end}
            era={characterItem.era}
            deleteCharacterItem={deleteCharacterItem}
            modifyCharacterItem={modifyCharacterItem} />)}
        </tbody>

      </table>
    </div>


  )
}

export default App
