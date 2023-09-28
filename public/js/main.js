// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const 
        name = document.querySelector('#yourname').value,
        username = document.querySelector('#username').value,
        email = document.querySelector('#email').value,
        position = document.querySelector('#position').value,
        json = {yourname: name, username: username, email: email, position: position},
      
        body = JSON.stringify( json )


  
  function validate_input() {
    console.log("Validating input...");
    if (name === "" || username === "" || email === "" || position === "") {
      return false;
    }
  return true;
  }

  if(validate_input() === false) {
    alert("Please fill out all fields.");
    return;
  }
  else
  {
    console.log("Input validated.");
  }

  const response = await fetch( '/submit', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body
  });

if (response.ok) {
  // Data was successfully submitted
  const text = await response.text();
  console.log('Server response:', text);

  // Clear form fields after submission
  document.querySelector('#yourname').placeholder = 'Your real name here.';
  document.querySelector('#username').placeholder = 'Your gamertag here.';
  document.querySelector('#email').placeholder = 'Your email here.';
  document.querySelector('#position').placeholder = 'What\'s your position?';

  // Refresh the table to display updated data
  updateTable();
} else {
  console.error('Error submitting data to the server');
}
};



// Function to update the table with data from the server
const updateTable = async function() {
  const response = await fetch('/get');

  if (response.ok) {
    const data = await response.json();
    console.log('Table data:', data);
    // Call a function to populate/update the table with the received data
    populateTable(data);
  } else {
    console.error('Error fetching data from the server');
  }
};

// Function to populate/update the table with received data
const populateTable = function(data) {
  const tableBody = document.querySelector('#table-body');
  tableBody.innerHTML = ''; // Clear existing table rows [May delete this line]



  data.forEach(function(player,index){
    const row = document.createElement('tr');
    row.innerHTML = `
      <td> <input type="button" id=${index} onclick="editPlayer(${index})" value="Edit"></td>
      <td> <input type="button" id=${index} onclick="deletePlayer(${index})" value="Delete"></td>
      <td>${player.yourname}</td>
      <td>${player.username}</td>
      <td>${player.email}</td>
      <td>${player.position}</td>
    `;
    tableBody.appendChild(row);
  });
};

// Function to delete a player from the table
const deletePlayer = async function(index) {
  console.log('Deleting player with index:', index);
  const response = await fetch('/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ index: index })
  })
  updateTable();
};

// Function to edit a player from the table
const editPlayer = async function(index) {
  //This is needed for playerData.
  const 
        name = document.querySelector('#yourname').value,
        username = document.querySelector('#username').value,
        email = document.querySelector('#email').value,
        position = document.querySelector('#position').value,
        json = {yourname: name, username: username, email: email, position: position}

  console.log('Editing player with index:', index);
  const response = await fetch('/edit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ index: index, playerdata: json})
  })
  updateTable();
};


window.onload = function() {
  const button = document.querySelector("button");
  button.onclick = submit;
  updateTable();
}