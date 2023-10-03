import reactLogo from "./assets/react.svg";
import "./App.css";

import React, { useState, useEffect } from 'react'

const Todo = props => (
  <li>
    <div class="listItem">
      <input type="checkbox" defaultChecked={props.completed} onChange={ e => props.onclick( props.todo, e.target.checked ) }/>
      <p class="todo">{props.todo}</p>
      <p class="date">Due Date: {props.date}</p>
      <p class="urgency">{props.urgency}</p>
      <button id="delete" onClick={ e => props.onDelete(props.todo)}>Delete</button>
    </div>
  </li>

  /*<li>{props.name} : 
    <input type="checkbox" defaultChecked={props.completed} onChange={ e => props.onclick( props.name, e.target.checked ) }/>
  </li>*/
)

const App = () => {
  const [todos, setTodos] = useState([ ]) 

  function toggle( todo, completed ) {
    fetch( '/change', {
      method:'POST',
      body: JSON.stringify({ todo, completed }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then( response => response.json() )
    .then( json => {
       setTodos( json )
    })
  }

  function add() {
    const value = document.querySelector('input').value
    const todoInput = document.querySelector("#todo").value;
    const dateInput = document.querySelector("#date").value;
    
    const currentDate = new Date();
    const targetDate = new Date(dateInput.value);
    targetDate.setHours(targetDate.getHours() + 4)
    const timeDifference = targetDate.getTime() - currentDate.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);
    let urgency = "Not Urgent";
    if(daysDifference < 0){
      urgency = "Late"
    }
    else if(daysDifference <= 7){
      urgency = "Urgent"
    }

    fetch( '/add', {
      method:'POST',
      body: JSON.stringify({ todo:todoInput, date: dateInput, urgency: urgency, completed:false }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then( response => response.json() )
    .then( json => {
       setTodos( json )
    })
  }

  function deleteItem(todo) {
    fetch( '/delete', {
      method:'POST',
      body: JSON.stringify({ todo }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then( response => response.json() )
    .then( json => {
       setTodos( json )
    })
  }
  
  // make sure to only do this once
  if( todos.length === 0 ) {
    fetch( '/read' )
      .then( response => response.json() )
      .then( json => {
        setTodos( json ) 
      })
  }
    
  useEffect( ()=> {
    document.title = `${todos.length} todo(s)`
  })

  return (
    <div className="App">
      <div class="container">
        <form>
        <h1>MY TODO LIST</h1>
        <label for="todo">TODO</label>
        <input class="textbox" type="text" id="todo" />
        <label for="date">Due Date</label>
        <input class="textbox" type="date" id="date" />
        <div class="button">
          <button id="add" onClick={ e => add()}>add</button>
        </div>
        </form>
      </div>
      <div class="container">
      <ul id="todoList">
        { todos.map( (todo,i) => <Todo key={i} todo={todo.todo} date={todo.date} urgency={todo.urgency} completed={todo.completed} onclick={ toggle } onDelete={deleteItem}/> ) }
     </ul> 
     </div>
    </div>
  )
}

export default App