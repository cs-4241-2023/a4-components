let LowPriorityAdd;
let MediumPriorityAdd;
let HighPriorityAdd;
let DueDateAddLabel;
let taskPriority = 1;
let newTaskDueDate = "";

//Add A Task On The Server
async function addTask(event) {
  event.preventDefault();

  const input = document.querySelector("#task-input");

  if (input.value !== "" && newTaskDueDate != "") {
    const taskData = {
      TaskName: input.value,
      DueDate: newTaskDueDate,
      Priority: taskPriority,
      MyDay: true,
    };

    const requestData = {
      type: "addTask",
      taskData: taskData,
    };

    console.log(requestData);

    const response = await fetch( '/submit', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify( requestData )
    })

    const text = await response.text();
    console.log("text:", text);

    input.value = "";
    taskPriority = 1;
    setPriority(
        [LowPriorityAdd, MediumPriorityAdd, HighPriorityAdd],
        taskPriority
    );
    newTaskDueDate = todayDate();
    DueDateAddLabel.textContent = todayDate();

    updateTasks();
  }
}

//Enter key Listener
window.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask(event);
  }
});

//Remove Task On The Server
async function removeTask(id) {
  const requestData = {
    type: "deleteTask",
    deleteRow: id,
  };

  console.log(requestData);

  const response = await fetch( '/submit', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify( requestData )
  })

  updateTasks();
}

//Update Tasks On The Server
async function updateTask(event, id, newTaskName, newDueDate, newPriority, newMyDay) {
  event.preventDefault();

  if (newTaskName !== "") {
    const taskData = {
      TaskName: newTaskName,
      DueDate: newDueDate,
      Priority: newPriority,
      MyDay: newMyDay,
    };

    const requestData = {
      type: "updateTask",
      taskData: taskData,
      id: id,
    };

    const response = await fetch( '/submit', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify( requestData )
    })

    const text = await response.text();
    console.log("text:", text);

    updateTasks();
  }
}

//Update Task Table
async function updateTasks() {
  const response = await fetch('/appdata');
  const appData = await response.json();
  console.log("Fetched appData:", appData);

  //Clear Table And Get Reference
  const table = document.getElementById("task-table");
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }

  for (let i = 0; i <= appData.length - 1; i++) {
    //Fetch App Data And Create A New Row And Cell
    const currentTask = appData[i];
    const newRow = document.createElement("tr");
    const taskCell = document.createElement("td");

    //Create Left Div Container
    const leftContainer = document.createElement("div");
    leftContainer.className = "left-container";

    //Create A Task Completion Button And Trigger Task Delete On Click
    const doneButton = document.createElement("button");
    doneButton.className = "Completion-Button";
    doneButton.title = "Complete The Task";

    doneButton.addEventListener("click", () => {
      removeTask(currentTask["_id"]);
    });

    //Create Task Text, Update It, And Make It Editable
    const taskText = document.createElement("input");
    taskText.type = "text";
    taskText.value = currentTask["TaskName"];
    taskText.title = "Click To Rename The Task";

    //Create Right Div Container
    const rightContainer = document.createElement("div");
    rightContainer.className = "right-container";

    //Create Priority Buttons, Update Them, And Make Them Editable
    const lowPriority = document.createElement("button");
    lowPriority.className = "LowPriority-Button";
    lowPriority.title = "Low Priority";
    const mediumPriority = document.createElement("button");
    mediumPriority.className = "MediumPriority-Button";
    mediumPriority.title = "Medium Priority";
    const highPriority = document.createElement("button");
    highPriority.className = "HighPriority-Button";
    highPriority.title = "High Priority";

    lowPriority.addEventListener("click", () => {
      updateTask(event, currentTask["_id"], taskText.value, currentTask["DueDate"], 1, true);
    });

    mediumPriority.addEventListener("click", () => {
      updateTask(event, currentTask["_id"], taskText.value, currentTask["DueDate"], 2, true);
    });

    highPriority.addEventListener("click", () => {
      updateTask(event, currentTask["_id"], taskText.value, currentTask["DueDate"], 3, true);
    });

    switch (currentTask["Priority"]) {
      case 1:
        lowPriority.classList.toggle("active");
        break;
      case 2:
        mediumPriority.classList.toggle("active");
        break;
      case 3:
        highPriority.classList.toggle("active");
        break;
    }

    taskText.addEventListener("focusout", () =>
        updateTask( event, currentTask["_id"], event.target.value, currentTask["DueDate"], currentTask["Priority"], true)
    );

    // Create A My Day Button And Force It Active
    const myDayButton = document.createElement("button");
    myDayButton.className = "MyDay-Button";
    myDayButton.title = "Added To My Day";

    if (currentTask["MyDay"]) {
      myDayButton.classList.toggle("active");
    }

    // Create A Custom Date Picker, Update It, And Make It Editable
    const datepickerToggle = document.createElement("span");
    datepickerToggle.classList.add("datepicker-toggle");

    const dateText = document.createElement("span");
    dateText.classList.add("date-text");
    //Do The "Overdue, Due Today, Tommorow, Normal Due Date" Calulcation Based On Due Date
    dateText.textContent = getTaskDeadlineLabel(currentTask["DueDate"]);

    const datepickerToggleButton = document.createElement("span");
    datepickerToggleButton.classList.add("datepicker-toggle-button");

    const datepickerInput = document.createElement("input");
    datepickerInput.setAttribute("type", "date");
    datepickerInput.classList.add("datepicker-input");
    datepickerInput.title = "Choose A Due Date";

    datepickerToggle.appendChild(dateText);
    datepickerToggle.appendChild(datepickerToggleButton);
    datepickerToggle.appendChild(datepickerInput);

    let previousDate = datepickerInput.value;

    datepickerInput.addEventListener("change", (event) => {
      if (!datepickerInput.value) {
        datepickerInput.value = previousDate;
      } else {
        previousDate = datepickerInput.value;
      }
      updateTask( event, currentTask["_id"], taskText.value, formatDate(datepickerInput.value), currentTask["Priority"], true);
    });

    //Append All Of The Task Row Items Together Then To The Table
    leftContainer.appendChild(doneButton);
    leftContainer.appendChild(taskText);
    rightContainer.appendChild(datepickerToggle);
    rightContainer.appendChild(lowPriority);
    rightContainer.appendChild(mediumPriority);
    rightContainer.appendChild(highPriority);
    rightContainer.appendChild(myDayButton);
    taskCell.appendChild(leftContainer);
    taskCell.appendChild(rightContainer);
    newRow.appendChild(taskCell);
    table.appendChild(newRow);
  }
}

//On Load
window.onload = function () {
  //Update The Table
  updateTasks();

  //Mark My Day Button In Add Task As Active
  const MyDay = document.querySelector(".MyDay-Button");
  MyDay.classList.toggle("active");

  //Add Event Listener To Add Task
  const AddTask = document.querySelector(".AddTask-Button");
  AddTask.addEventListener("click", addTask);

  //Start The Due Date At Today
  DueDateAddLabel = document.querySelector(".datepicker-toggle .date-text");
  newTaskDueDate = todayDate();
  DueDateAddLabel.textContent = newTaskDueDate;

  //Query Priority Buttons And Add Event Listeners That Change New Task Priority
  LowPriorityAdd = document.querySelector(".LowPriority-Button");
  MediumPriorityAdd = document.querySelector(".MediumPriority-Button");
  HighPriorityAdd = document.querySelector(".HighPriority-Button");

  setPriority([LowPriorityAdd, MediumPriorityAdd, HighPriorityAdd], 1);
  LowPriorityAdd.addEventListener("click", () =>
      setPriority([LowPriorityAdd, MediumPriorityAdd, HighPriorityAdd], 1)
  );
  MediumPriorityAdd.addEventListener("click", () =>
      setPriority([LowPriorityAdd, MediumPriorityAdd, HighPriorityAdd], 2)
  );
  HighPriorityAdd.addEventListener("click", () =>
      setPriority([LowPriorityAdd, MediumPriorityAdd, HighPriorityAdd], 3)
  );

  //Add Due Date Selector Functionality
  let DueDateAdd = document.querySelector("#Due-Date");
  let previousDate = DueDateAdd.value;
  DueDateAdd.addEventListener("change", () => {
    if (!DueDateAdd.value) {
      DueDateAdd.value = previousDate;
    } else {
      previousDate = DueDateAdd.value;
    }
    newTaskDueDate = formatDate(DueDateAdd.value);
    DueDateAddLabel.textContent = newTaskDueDate;
  });
};

//Determine What Task Deadline Message To Display
function getTaskDeadlineLabel(taskDeadline) {
  const deadlineDate = new Date(taskDeadline);
  const today = new Date();
  const dayDifference = deadlineDate - today;
  const dayDifferenceInDays =
      Math.floor(dayDifference / (1000 * 60 * 60 * 24)) + 1;

  switch (true) {
    case dayDifferenceInDays < 0:
      return "Overdue";
    case dayDifferenceInDays === 0:
      return "Due Today";
    case dayDifferenceInDays === 1:
      return "Due Tomorrow";
    default:
      return taskDeadline;
  }
}

//Today's Date
function todayDate() {
  const currentDate = new Date();
  return `${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${currentDate
      .getDate()
      .toString()
      .padStart(2, "0")}/${currentDate.getFullYear()}`;
}

//Format The Raw Date Input To mm/dd/yyyy
function formatDate(newTaskDueDate) {
  const [yy, mm, dd] = newTaskDueDate.split("-");
  const formattedDate = `${mm}/${dd}/${yy}`;
  return formattedDate;
}

//Set Priority
function setPriority(buttons, priority) {
  taskPriority = priority;
  buttons.forEach((button) => {
    button.classList.remove("active");
  });
  buttons[priority - 1].classList.toggle("active");
}