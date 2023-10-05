import React, { useState, useEffect } from 'react';
import './main.css';

function App() {
  
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [dueDate, setDueDate] = useState('');
  let idCounter = 0;

  const fetchTodos = async () => {
    const response = await fetch('/getTodos');
    const todos = await response.json();
    setTodos(todos);
  };

  const submit = async (event) => {
    event.preventDefault();
    const json = { id: idCounter++, todoinput: newTodo, dueDate: dueDate };
    console.log("hi1")
    const response = await fetch('/submit', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(json),
    });

    const text = await response.text();
    console.log('Response:', text);
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    const response = await fetch('/delete', {
      method: 'POST',
      body: JSON.stringify({ id }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = await response.text();
    console.log(result);
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div>
      <form onSubmit={submit}>
        {/* <div class="todo-container">
      <h1>My To-Do List</h1>
      
      <form method="post">
        <table id = submitTable>
          <tr>
            <td><input type="text" id="newTodoInput" placeholder="Add a new task..."></td>
            <td><input type="date" id="dueDate"></td>
            <td><button type = "submit" id="submitForm">Submit</button> </td>
          </tr>
        </table>
      </form>
      <table id="todoTable">
        <thead>
            <tr>
                <th>Todo</th>
                <th>DUE ON</th>
                <th>Priority</th>

            </tr>
        </thead>
        <tbody>

        </tbody>
    </table>
  
      <ul id="todoList"></ul> */}
        <input 
          type="text" 
          id="newTodoInput" 
          placeholder="Add a new task..."
          value={newTodo} 
          onChange={(e) => setNewTodo(e.target.value)}
        />
        
        <input 
          type="date" 
          id="dueDate" 
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        
        <button type="submit">Submit</button>
        <thead>
            <tr>
                <th>Todo</th>
                <th>DUE ON</th>
                <th>Priority</th>

            </tr>
        </thead>
      </form>
      <ul id="todoList">
        {todos.map(todo => (
          <li key={todo.id}>
            {`${todo.todoinput} | ${todo.dueDate} | ${todo.priority} `}
            <button className="deleteButton" onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/*
function App() {
  return (
    <div className="App">
      <TodoApp />
    </div>
  );
}
*/
export default App;
