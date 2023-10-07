const submit = async function( event ) {
  event.preventDefault()
  
  const form = document.querySelector('form')
  let task = form["taskname"].value;
  let dueDate = new Date(form["duedate"].value);

  let taskValid = task !== "" && task !== undefined;
  let dueDateValid = dueDate.value !== "";

  if(!taskValid){
    alert("Task is invalid");
  }
  if(!dueDateValid){
    alert("Due Date is invalid");
  }


  if(taskValid && dueDateValid)
  {
    dueDate.setDate(dueDate.getDate()+1);
    let due=dueDate.toLocaleDateString();

    let json = {task, due};
    let body = JSON.stringify( json );

    console.log("Body: " +body);

    const response = await fetch( '/json', {
          method:'POST',
          body
        })
    const data = await response.json();
    LoadFromServer(data);
    ClearForm();
  }
}

function ClearForm(){
  const form = document.querySelector( '#addItemContainer' );
  form.taskname.value="";
  form.duedate.value="";
}

function CreateDeleteButton(index){
  let json = {index};
  let dataIndex = JSON.stringify( json );
  const cell = document.createElement('td');
  cell.className="delete";

  const button=document.createElement('button');
  button.className="delete-button";
  button.innerHTML = `\u00D7`;
  button.onclick= (e) => {
    deleteData(dataIndex);
  }
  cell.append(button);
  return cell;
}

function CreateCell(cellInfo){
  const cell = document.createElement('td');
  cell.innerHTML = `<p>${cellInfo}</p>`;
  return cell;
}


function CreateFirstRow(){
  let row=document.createElement("tr");
  row.append(CreateHeaderCell(""));
  row.append(CreateHeaderCell("Task"));
  row.append(CreateHeaderCell("Due Date"));
  return row;
}

function CreateHeaderCell(cellInfo){
  const cell = document.createElement('th');
  cell.innerHTML = `<p>${cellInfo}</p>`;
  return cell;
}

function CreateRow(task,due,index){
  let row=document.createElement("tr");
  row.append(CreateDeleteButton(index));
  row.append(CreateCell(task));
  row.append(CreateCell(due));
  return row;
}

const deleteData = (dataIndex) => {
  const body = dataIndex;
  fetch( "/json", {
    method:"DELETE",
    body
  }).then(() =>{
    window.location.reload();
  })
}


function LoadFromServer(data){
  const table=document.createElement("table");
  let firstRow=CreateFirstRow();

  table.append(firstRow);
  data.forEach((item,index) => {
    console.log(index);
    let row=CreateRow(item["task"], item["due"],index);
    table.append(row);
  });

  let htmlTable=document.getElementById("task-table");
  htmlTable.replaceChildren();
  htmlTable.append(table);
}

window.onload = async function() {
  const addButton = document.querySelector(".add-button");
  addButton.onclick = submit;

  const response = await fetch( '/json', {
    method:'GET'
  })
  const data = await response.json();
  LoadFromServer(data);
}