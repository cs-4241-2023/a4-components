import { useState, useEffect } from 'react'
import './index.css'
var user = 'admin'

const App = () => {
  const [todos, setTodos] = useState([])
  const [anyChecked, setAnyChecked] = useState(false)

  useEffect(() => {
    get()
  }, [])

  function get() {
    fetch(`/get-list/${user}`)
      .then(response => response.json())
      .then(json => {
        setTodos(json)
      })
  }

  function add() {
    const todo = document.querySelector('#todo-name'),
      date = document.querySelector('#due-date'),
      desc = document.querySelector('#description'),
      id = Math.random().toString(36).substring(2, 10),
      json = { user: user, id: id, task: todo.value, date: date.value, desc: desc.value },
      body = JSON.stringify(json)
    fetch('/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    })
      .then(response => response.json())
  }

  function remove() {
    // get the id of the row with the checked box
    const id = document.querySelector('input:checked').id
    fetch(`/delete-row/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(get())
  }

  function modify() {
    // get the id of the row with the checked box
    const id = document.querySelector('input:checked').id
    const todo = document.querySelector('#todo-name'),
      date = document.querySelector('#due-date'),
      desc = document.querySelector('#description'),
      json = { user: user, id: id, task: todo.value, date: date.value, desc: desc.value },
      body = JSON.stringify(json)
    fetch(`/edit-row/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body
    })
      .then(response => response.json())
      .then(get())
  }

  function checkAnyChecked() {
    // check if any checkboxes are checked
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    for (const checkbox of checkboxes) {
      if (checkbox.checked) {
        setAnyChecked(true);
        return;
      }
    }
    setAnyChecked(false);
  }

  return (
    <>
      <div>
        <h1 id="app-header">Welcome {user}</h1>
        <form>
          <label htmlFor="todo-name">Task Name:</label>
          <input type="text" id="todo-name" placeholder="Enter task name" />
          <label htmlFor="due-date">Due Date:</label>
          <input type="date" id="due-date" />
          <label htmlFor="description">Description:</label>
          <input type="text" id="description" placeholder="Enter description" />
          { !anyChecked ? 
          <button onClick={e => add()}>Create task</button> : 
          <button onClick={e => modify()}>Modify task</button> }
        </form>
        <ul id="todo-list">
        </ul>
        <table id="todo-table">
          <thead className="table-head">
            <tr>
              <th>⠀</th>
              <th>Task Name</th>
              <th>Due Date</th>
              <th>Description</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody id="table-body">
            {todos.length > 0 ?
              todos.map(todo => {
                return (
                  <tr key={todo.id}>
                    <td>  
                      <input 
                        type="checkbox" 
                        id={todo.id}
                        onChange={e => checkAnyChecked()}
                      />
                    </td>
                    <td>{todo.task}</td>
                    <td>{todo.date}</td>
                    <td>{todo.desc}</td>
                    <td>{todo.priority}</td>
                  </tr>
                )
              }) : <tr><td colSpan="5">No tasks found</td></tr>}
          </tbody>
        </table>
        { anyChecked ? <button onClick={e => remove()}>Delete task</button> : null }
      </div>
    </>
  )
}

export default App
