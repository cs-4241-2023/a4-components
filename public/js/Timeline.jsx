import React, { useState, useEffect } from 'react'

const TimelineItem = props => {
  const {_id, era, date, description, deleteTimelineItem, modifyTimelineItem} = props;


  

 

  return (
  <div className='container'>
    <div className='content'>
      <button onClick={e => deleteTimelineItem(era, date, description)}>X</button>
      <button onClick={e => modifyTimelineItem(_id, era)}>Modify</button>
      <h1>{props.era}</h1>
      <h2>{props.date}</h2>
      <p>{props.description}</p>
    </div>
  </div>
  )
  }

export let localTimelineInstance = "temp";
export const timelineChangeEvent = new Event('timelineChange');

const App = () => {
  const [timelineItems, setTimelineItems] = useState([])


  async function addTimelineItem() {

    const response = await fetch('/timelineData', {
      method: 'GET'
    })

    const data = await response.json();


    const eraInput = document.querySelector('#era');
    const dateInput = document.querySelector('#date');
    const descriptionInput = document.querySelector('#description');
    const errorMsg = document.getElementById("timelineErrorMessage")

    const eraArray = [];

    for (let i = 0; i < data.length; i++) {
      eraArray.push(data[i].era);
    }

    if (eraArray.includes(eraInput.value)) {
      console.log("uniqueness")
      errorMsg.textContent = "Name must be unique"
      errorMsg.style.display = "block";
    } else if (isNaN(dateInput.value)) {
      console.log("numbers")
      errorMsg.textContent = "Enter Numerical Value for date"
      errorMsg.style.display = "block";
      return false;
    } else {

      errorMsg.style.display = "none"
      const postResponse = await fetch('/timelineData', {
        method: 'POST',
        body: JSON.stringify({ era: eraInput.value, date: parseInt(dateInput.value), description: descriptionInput.value }),
        headers: { 'Content-Type': 'application/json' }
      })

      const json = await postResponse.json();
      localTimelineInstance = json;
      window.dispatchEvent(timelineChangeEvent);
      setTimelineItems(json);
    }
  }

  async function deleteTimelineItem(era, date, description) {
    const timelineData = await fetch("/timelineData", {
      method: "DELETE",
      body: JSON.stringify({ era: era, date: date, description: description })
    })
  
    const json = await timelineData.json();
    localTimelineInstance = json;
    window.dispatchEvent(timelineChangeEvent);
    setTimelineItems(json);
  }

  async function modifyTimelineItem(_id, era) {

    const response = await fetch('/timelineData', {
      method: 'GET'
    })

    const data = await response.json();

    const eraInput = document.querySelector('#era');
    const dateInput = document.querySelector('#date');
    const descriptionInput = document.querySelector('#description');
    const errorMsg = document.getElementById("timelineErrorMessage")

    const eraArray = [];

    for (let i = 0; i < data.length; i++) {
      eraArray.push(data[i].era);
    }


    if (eraArray.includes(eraInput.value) && era != eraInput.value) {
      console.log("uniqueness")
      errorMsg.textContent = "Name must be unique"
      errorMsg.style.display = "block";
    } else if (isNaN(dateInput.value)) {
      console.log("numbers")
      errorMsg.textContent = "Enter Numerical Value for date"
      errorMsg.style.display = "block";
      return false;
    } else {
        const timelineData = await fetch("/modifyTimelineData", {
        method: "POST",
        body: JSON.stringify({ _id: _id, era: eraInput.value, date: parseInt(dateInput.value), description: descriptionInput.value })
      })
  
      const json = await timelineData.json();
      localTimelineInstance = json;
      window.dispatchEvent(timelineChangeEvent);
      setTimelineItems(json);
    }
  }

  

  // make sure to only do this once
  if (timelineItems.length === 0) {
    fetch('/timelineData', {
      method: 'GET'
    })
      .then(response => response.json())
      .then(json => {
        setTimelineItems(json)
      })
  }

  useEffect(() => {
    fetch('/timelineData', {
      method: 'GET'
    })
      .then(response => response.json())
      .then(json => {
        setTimelineItems(json)
      })
  }, [])


  return (
    <div>
    <form>
        <label className="timelineSubmission" htmlFor="era">Era Name:</label>
        <input type="text" id="era" /> <br />
        <label className="timelineSubmission" htmlFor="date">Starting Year:</label>
        <input type="text" id="date" /> <br />
        <label className="timelineSubmission" htmlFor="description">Description:</label>
        <input type="text" id="description" /> <br />
        
        
      </form>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button onClick={e => addTimelineItem()}>add</button>
        <label id="timelineErrorMessage">Please enter a numerical year</label>
      </div>
      
    <div className="timeline">
      
     
        {timelineItems.map((timelineItem, i) => <TimelineItem key={i} 
                                                                      _id={timelineItem._id} 
                                                                      era={timelineItem.era} 
                                                                      date={timelineItem.date}
                                                                      deleteTimelineItem={deleteTimelineItem}
                                                                      modifyTimelineItem={modifyTimelineItem}  />)}
      
    </div>
    </div>


  )
}

export default App
