/*const submit = async function (event) {
    event.preventDefault()
    const course = document.querySelector("#course");
    const assignment = document.querySelector("#assignment");
    const dueDate = document.querySelector("#due-date");
    const dueTime = document.querySelector("#due-time");
  
    if(course.value === ''){
        window.alert("Please enter course")
        return
      }
      if(dueDate.value === ''){
        window.alert("Please enter due date")
        return
      }
    //const daysLeft = calculateDaysLeft(dueDate.value);

    json = {course: course.value,assignment: assignment.value,dueDate: dueDate.value,dueTime: dueTime.value},
      body = JSON.stringify(json)
  
    const response = await fetch('/submit', {
      method: 'POST',
      body
    })
    const data = await response.json()
    createTable(data);
  }

  const removeRow = async function (assignment) {
  
    let json = { assignmentToRemove: assignment }
    let body = JSON.stringify(json)
    fetch('/delete', {
      method: 'DELETE',
      body
    }).then(response => response.json())
      .then(json => {
        createTable(json)
      })
    return false;
  }
  
  
  const createTable = function (jsonData) {
    const table = document.querySelector("#homework-table")
    console.log(table)
    table.innerHTML = "<tr> <th>Course</th><th>Assignment</th><th>Due Date</th><th>Due Time</th><th>Days Left</th><th>Done?</th> </tr>"
    jsonData.forEach(assignment => {
      table.innerHTML += `<tr> <td>${assignment.course}</td> <td>${assignment.assignment}</td> <td>${assignment.dueDate}</td><td>${assignment.dueTime}</td><td>${assignment.daysLeft}</td><td><button onclick="removeRow(\'${assignment.assignment}\')">done</button></td></tr>`
    })
  }

  
  
  
  window.onload = function () {
    const button = document.querySelector("button");
    button.onclick = submit
    fetch('/data', {
      method: 'GET',
    }).then(response => response.json())
      .then(json => {
        createTable(json)
      })
  } */