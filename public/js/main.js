// FRONT-END (CLIENT) JAVASCRIPT HERE

var loggedInUser = null;
const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const form = document.querySelector('form')


  const inputName = form["name"],
        inputEmail = form["email"],
        inputType = form["type"],
        inputDepartment = form["department"]
        inputPass = form['password']

  console.log(inputName)
  console.log(inputEmail)
  console.log(inputType)
  console.log(inputDepartment)
      
  const json = { 'name': inputName.value, 'email': inputEmail.value, 'type': inputType.value, 'dept': inputDepartment.value, 'pass': inputPass.value }, //whatever: "whatever" },
        body = JSON.stringify( json )
  
  const response = await fetch( '/newUser', {
    method:'POST',
    body
  })

  const text = await response.text()
  
  form.reset()
  addToTable(JSON.parse(text))
}

const clearAll = async function ( event ){  
  body = {all: true}
  const response = await fetch( "/clearUsers", {
    method:"DELETE",
    body: body
  })
  const text = await response.text()
  location.reload()
}

const getUsersData = async function ( event ){  
  const response = await fetch( '/getUsers' )
  const text = await response.text()
  updateTable(JSON.parse(text))
}

function updateTable(newData){
  for (let i = 0; i < Object.keys(newData).length; i++){
    addToTable(newData[i])
  }
}

function addToTable(newRow){
    const table = document.getElementById('usertable').getElementsByTagName('tbody')[0]
    var row = table.insertRow(-1);
    // var x = row.insertCell(0;
    // x.innerHTML = "<p>new cell</p>";
    // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
    var nameCell = row.insertCell(0);
    var emailCell = row.insertCell(1);
    var typeCell = row.insertCell(2);
    var majorCell = row.insertCell(3);
    var xCell = row.insertCell(4);

    nameCell.innerHTML = newRow["name"]
    emailCell.innerHTML = newRow["email"]
    typeCell.innerHTML = newRow["type"]
    majorCell.innerHTML = newRow["dept"]

    const xButton = document.createElement('button');
    xButton.className = 'deleteButton'
    xButton.onclick=() => {
      editUser(newRow);
    }
    xButton.className = "editButton"
    xButton.innerHTML = "Edit"
    xCell.append(xButton)
}

async function editUser(user){
  console.log(user)
  const response = await fetch( '/edit', {
    method:'POST',
    body: JSON.stringify(user)
  })
  window.location.replace('/edit.html')
}
async function getLoggedInUser(){
  const loggedInUserLabel = document.getElementById("loggedinuser");
  const response = await fetch( '/getLoggedInUser' )
  const text = await response.text()

  loggedInUserLabel.innerHTML = "Logged in as: " + JSON.parse(text).email
  loggedInUser = JSON.parse(text)
} 

async function logout(){
  const body = {}
  const response = await fetch( '/logout', {
    method:'POST',
    body
  })
  const text = await response.text()
  window.location.replace('/login.html')
}

window.onload = function() {
  const submitButton = document.getElementById("submitButton");
  const logoutButton = document.getElementById("logoutButton");

  //const clearTableButton = document.getElementById("clearTableButton");
  getUsersData()
  getLoggedInUser()
  submitButton.onclick = submit;
  logoutButton.onclick = logout;
  //clearTableButton.onclick = clearAll
}