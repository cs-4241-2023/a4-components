import { useState, useEffect } from 'react'

const App = () => {
  const [todos, setTodos] = useState([ ]) 
/*
  function toggle( course, assignment, dueDate, dueTime, completed ) {
    fetch( '/change', {
      method:'POST',
      body: JSON.stringify({ course, assignment, dueDate, dueTime, completed }),
      headers: { 'Content-Type': 'application/json' }
    })
  }

  function add() {
    const input1 = document.querySelector('#course').value
    const input2 = document.querySelector('#assignment').value
    const input3 = document.querySelector('#duedate').value
    const input4 = document.querySelector('#duetime').value

    fetch( '/add', {
      method:'POST',
      body: JSON.stringify({ course: input1, assignment: input2, duedate: input3, duetime: input4, completed:false }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then( response => response.json() )
    .then( json => {
       setTodos( json )
    })
  }
  
  function submit() {
    const input1 = document.querySelector('#course').value
    const input2 = document.querySelector('#assignment').value
    const input3 = document.querySelector('#duedate').value
    const input4 = document.querySelector('#duetime').value

    fetch( '/submit', {
      method:'POST',
      body: JSON.stringify({ course: input1, assignment: input2, duedate: input3, duetime: input4, completed:false  }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then( response => response.json() )
    .then( json => {
      setTodos( json )
    })
  }
*/
  // make sure to only do this once
 const getData = async function() {
  await fetch( '/read' )
            .then( response => response.json() )
            .then( json => {
              setTodos( json ) 
  }) 
 }
    
  useEffect( ()=> {
    document.title = `${todos.length} assignment(s)`
    getData();
  }, [])

  return (
    <div className="App">
    <h1 className="center">Homework Tracker</h1>
    <p>add your upcoming assignment:</p>
    <form id="homework">
      <input type="text" id="course" placeholder="course"/>
      <input type="text" id="assignment" placeholder="assignment details"/>
      <input type="date" id="duedate"/>
      <input type="time" id="duetime" value="23:59" onChange={(e) => {}} />
      <button type="submit">submit</button>
    </form>
      <br/>

      <table id="homework-table">
        <tbody>
          <tr>
            <th>#</th>
            <th>Course</th>
            <th>Assignment</th>
            <th>Due Date</th>
            <th>Due Time</th>
            <th>Done?</th>
          </tr>
          { todos.map( (todo,i) => <tr> <td>key={i}</td> <td>{todo.course}</td> <td>{todo.assignment}</td> <td>{ todo.duedate }</td> <td>{ todo.duetime }</td> <td><input type="checkbox" defaultChecked={props.completed} onChange={ e => props.onclick( props.name, e.target.checked ) }/></td></tr> ) }
        </tbody>
      </table> 
    </div>
  )}


export default App;