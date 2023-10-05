// FRONT-END (CLIENT) JAVASCRIPT HERE
let idCounter = 0
const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const input = document.querySelector( '#newTodoInput' ),
  dueDate = document.querySelector('#dueDate').value,
  json = {id: idCounter++, todoinput: input.value, dueDate: dueDate}
        //body = JSON.stringify( json )

  const response = await fetch( '/submit', {
    method:'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(json),
  })

  const text = await response.text()
  console.log('Response:', text);
  fetchTodos(); //I don't think this is necessary
}

const fetchTodos = async function() {
  const response = await fetch('/getTodos');
  const todos = await response.json();

  const todoList = document.querySelector('#todoList'); // delete maybe
  todoList.innerHTML = '';  // Clear current list

  const tbody = document.querySelector("#todoTable");

  todos.forEach(todo => {

    const todoItem = document.createElement('li');
    todoItem.textContent = `${todo.todoinput} | ${todo.dueDate} | ${todo.priority} `;



    let deleteBtn = document.createElement('button');
    deleteBtn.classList.add('deleteButton');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteTodo(todo.id);  // attach delete function to the button

    todoItem.appendChild(deleteBtn);
    todoList.appendChild(todoItem);

  });
}

const deleteTodo = async function(id) {
  const response = await fetch('/delete', {
    method: 'POST',
    body: JSON.stringify({ id }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const result = await response.text();
  console.log(result);

  // Refresh the list after deleting a todo
  fetchTodos();
}


window.onload = function() {
   const button = document.querySelector("button");
  button.onclick = submit;
  fetchTodos();
}