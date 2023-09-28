
const addTimelineItem = async function (event) {


  event.preventDefault()

  const response = await fetch('/timelineData', {
    method: 'GET'
  })

  const data = await response.json();

  const eraInput = document.querySelector('#era');
  const dateInput = document.querySelector('#date');
  const descriptionInput = document.querySelector('#description');
  console.log(dateInput.value);
  const errorMsg = document.getElementById("timelineErrorMessage")

  const eraArray = [];

  for (let i = 0; i < data.length; i++) {
    eraArray.push(data[i].era);
  }

  if (eraArray.includes(eraInput.value)) {
    errorMsg.textContent = "Name must be unique"
    errorMsg.style.display = "block";
  } else if (isNaN(dateInput.value)) {
    errorMsg.textContent = "Enter Numerical Value for date"
    errorMsg.style.display = "block";
    return false;
  } else {

    document.getElementById("timelineErrorMessage").style.display = "none";

    const json = { era: eraInput.value, date: parseInt(dateInput.value), description: descriptionInput.value }, body = JSON.stringify(json)

    const response = await fetch('/timelineData', {
      method: 'POST',
      body
    })

    const data = await response.json()

    console.log('text:', data)
    CreateTimeline(data);
    window.dispatchEvent(updateCharactersEvent)

    return true;
  }
}


function CreateTimeline(data) {
  const timeline = document.getElementById("myTimeline")

  timeline.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    const timelineItem = document.createElement("div");
    timelineItem.id = data[i]._id;
    const deleteButton = document.createElement("button");
    deleteButton.id = "Timeline Delete Button " + data[i].era;
    deleteButton.innerHTML = "X";

    const modifyButton = document.createElement("button");
    modifyButton.id = "Timeline Modify Button " + data[i].era;
    modifyButton.innerHTML = "Modify"

    //edit button appearance
    deleteButton.onclick = async function () {
      let text = data[i]._id;
      const tempButton = document.getElementById(text).outerHTML = "";
      let json = JSON.stringify(data[i]);
      const timelineData = await fetch("/timelineData", {
        method: "DELETE",
        body: json
      })

      const newTimeline = await timelineData.json();
      //account for in backend
      console.log(tempButton.id);
      window.dispatchEvent(updateCharactersEvent)
      CreateTimeline(newTimeline);

    }

    modifyButton.onclick = async () => {

      let text = "timelineItem" + i;

      const eraInput = document.querySelector('#era');
      const dateInput = document.querySelector('#date');
      const descriptionInput = document.querySelector('#description');
      //error checking
      const errorMsg = document.getElementById("timelineErrorMessage")

      const eraArray = [];

      for (let i = 0; i < data.length; i++) {
        eraArray.push(data[i].era);
      }

      const location = eraArray.indexOf(eraInput.value);
      if (eraArray.includes(eraInput.value) && location != i) {
        errorMsg.textContent = "Name must be unique"
        errorMsg.style.display = "block";
      }
      else if (isNaN(dateInput.value)) {
        errorMsg.textContent = "Enter a numerical value for starting year"
        errorMsg.style.display = "block";
      } else {

        const json = { _id: timelineItem.id, era: eraInput.value, date: parseInt(dateInput.value), description: descriptionInput.value }, body = JSON.stringify(json)

        const timelineData = await fetch("/modifyTimelineData", {
          method: "POST",
          body: body
        })

        const newTimeline = await timelineData.json();
        window.dispatchEvent(updateCharactersEvent)
        CreateTimeline(newTimeline);
      }





    }
    timelineItem.appendChild(deleteButton);
    timelineItem.appendChild(modifyButton);

    timelineItem.className = "container";
    const innerItemText = document.createElement("div");
    innerItemText.className = "content";
    innerItemText.innerHTML = "<h1>" + data[i].era + "</h1><h2>" + data[i].date + "</h2><p>" + data[i].description + "</p>"
    timelineItem.appendChild(innerItemText);


    timeline.appendChild(timelineItem);
  }
}



window.onload = async function () {
  const button = document.getElementById("addTimelineItemButton");
  button.onclick = addTimelineItem;

  const response = await fetch('/timelineData', {
    method: 'GET'
  })

  const data = await response.json();
  CreateTimeline(data);
}

const updateCharactersEvent = new CustomEvent('updateCharacters', {});