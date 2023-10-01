function formatDate(fullDate) {
  return fullDate.split("T")[0];
}

const populateTable = async () => {
  fetch('/getName')
    .then(response => response.text())
    .then(username => {
      console.log(username);  // Should print: "This is the string I want to send."
      document.getElementById("Welcome-Header").innerText = "Welcome " + username + "!";
    })
    .catch(error => {
      console.error('There was an error fetching the string:', error);
    });

  const tableBody = document.querySelector("#data-table tbody");

  tableBody.innerHTML = "";

  try {
    const response = await fetch("/getData");
    const data = await response.json();


    data.forEach((item, index) => {
      const row = document.createElement("tr");

      const taskInput = document.createElement("input");
      taskInput.value = item.task;
      const taskCell = document.createElement("td");
      taskCell.appendChild(taskInput);

      const hoursInput = document.createElement("input");
      hoursInput.type = "number";
      hoursInput.value = item.hours;
      const hoursCell = document.createElement("td");
      hoursCell.appendChild(hoursInput);

      const dueDateInput = document.createElement("input");
      dueDateInput.type = "date";
      dueDateInput.value = formatDate(item.dueDate);
      const dueDateCell = document.createElement("td");
      dueDateCell.appendChild(dueDateInput);

      const timeLeftInput = document.createElement("input");
      timeLeftInput.value = item.timeLeft;
      const timeLeftCell = document.createElement("td");
      timeLeftCell.appendChild(timeLeftInput);

      const priorityInput = document.createElement("input");
      priorityInput.value = item.priority;
      const priorityCell = document.createElement("td");
      priorityCell.appendChild(priorityInput);

      const actionCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => deleteData(item.task));
      actionCell.appendChild(deleteButton);

      const modifyActionCell = document.createElement("td");
      const modifyButton = document.createElement("button");
      modifyButton.textContent = "Modify";
      modifyButton.addEventListener("click", () =>
        modifyData(
          item._id,
          taskInput,
          hoursInput,
          dueDateInput,
          timeLeftInput,
          priorityInput
        )
      );
      modifyActionCell.appendChild(modifyButton);

      row.appendChild(taskCell);
      row.appendChild(hoursCell);
      row.appendChild(dueDateCell);
      row.appendChild(timeLeftCell);
      row.appendChild(priorityCell);
      row.appendChild(actionCell);
      row.appendChild(modifyActionCell);

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const modifyData = async (
  index,
  taskInput,
  hoursInput,
  dueDateInput,
  timeLeftInput,
  priorityInput
) => {
  const updatedData = {
    task: taskInput.value,
    hours: hoursInput.value,
    dueDate: dueDateInput.value,
    timeLeft: timeLeftInput.value,
    priority: priorityInput.value,
  };

  try {
    const response = await fetch(`/modifyData/${index}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    const result = await response.text();
    console.log("Server response:", result);
    populateTable();
  } catch (error) {
    console.error("Error modifying data:", error);
  }
};

const deleteData = async (task) => {
  try {
    const response = await fetch('/data', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task }),
    });

    if (response.ok) {
      console.log(await response.text());
      await populateTable();
    } else {
      console.error("Error deleting data:", await response.text());
    }
  } catch (err) {
    console.error("Error:", err);
  }
};

const submit = async function (event) {
  event.preventDefault();

  const taskInput = document.querySelector("#task");
  const hoursInput = document.querySelector("#hours");
  const dueDateInput = document.querySelector("#dueDate");

  const json = {
    task: taskInput.value,
    hours: parseFloat(hoursInput.value),
    dueDate: dueDateInput.value,
  };

  const body = JSON.stringify(json);

  try {
    const response = await fetch("/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    const text = await response.text();

    if (!response.ok) {
      window.alert(`Error: ${text}`);
      return;
    }
    console.log("Response:", text);

    await populateTable();
  } catch (error) {
    console.error("Error:", error);
  }
};

const signOut = async function (event) {
  fetch('/logout', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (response.ok) {
        window.location.href = '/login.html';  // Redirect to login page or wherever you'd like after logging out
      } else {
        console.error('Failed to log out');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}


window.onload = function () {
  const button = document.getElementById("submitButton");
  if (button != null) {
    button.onclick = submit;
  }
  const secondButton = document.getElementById("signOutButton");
  console.log("try");
  if (secondButton != null) {
    console.log("Adding");
    secondButton.addEventListener('click', signOut);
  }


  if (window.location.pathname === '/index.html') populateTable();
};
