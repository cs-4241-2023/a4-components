// FRONT-END (CLIENT) JAVASCRIPT HERE

var editUser = null;

var deleteButton 

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const form = document.querySelector('form')


  const inputType = form["type"],
        inputDept = form['dept'],
        inputPass = form['pass']
      
  const json = {'_id': editUser._id, 'type': inputType.value, 'dept': inputDept.value, 'pass': inputPass.value }, 
        body = JSON.stringify( json )
  
  const response = await fetch( '/update', {
    method:'POST',
    body
  })


  const text = await response.text()
  if (response == null){

  }
  window.location.replace('/index.html')
  form.reset()
}

const deleteUser = async function (){  
  body = JSON.stringify( editUser )
  const response = await fetch( "/deleteUser", {
    method:"DELETE",
    body:body
  })
  const text = await response.text()
  window.location.replace('/index.html')
}

async function getEditUser(){
  const editUserLabel = document.getElementById("editUserLabel");
  const passfield = document.getElementById("passfield");
  const typefield = document.getElementById("typefield");
  const deptfield = document.getElementById("deptfield");

  const response = await fetch( '/getEditUser')
  const text = await response.text()
  json = JSON.parse(text)
  passfield.value = json.pass
  typefield.value = json.type
  deptfield.value = json.dept
  if (json.type === "Systems Admin"){
    deleteButton.style.display = 'none'
  }
  editUserLabel.innerHTML = "Editing: " + json.email
  editUser = json
} 

async function back(){
  window.location.replace('/index.html')
}

window.onload = function() {
  getEditUser();
  const submitButton = document.getElementById("submitButton");
  const backButton = document.getElementById("backButton");
  deleteButton = document.getElementById("deleteButton");
  submitButton.onclick = submit;
  backButton.onclick = back;
  deleteButton.onclick = deleteUser
}