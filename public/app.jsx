import { useState, useEffect } from 'react'

const App = () => {
  const [todos, setTodos] = useState([ ]) 
  const [course, setCourse] = useState('');
  const [assignment, setAssignment] = useState('');
  const [dueDate, setDate] = useState('');
  const [dueTime, setTime] = useState('');

  function toggle( course, assignment, dueDate, dueTime, completed ) {
    fetch( '/change', {
      method:'POST',
      body: JSON.stringify({ course, assignment, dueDate, dueTime, completed }),
      headers: { 'Content-Type': 'application/json' }
    })
  }

  function add() {
    fetch( '/add', {
      method:'POST',
      body: JSON.stringify({ course: course, assignment: assignment, duedate: dueDate, duetime: dueTime, completed:false }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then( response => response.json() )
    .then( json => {
       setTodos( json )
    })
  }
  
  function submit() {
    fetch( '/submit', {
      method:'POST',
      body: JSON.stringify({ course: course, assignment: assignment, duedate: dueDate, duetime: dueTime, completed:false  }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then( response => response.json() )
    .then( json => {
      setTodos( json )
    })
  }

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
    <form id="homework" onSubmit={submit}>
      <input type="text" id="course" placeholder="course"  onChange={(e) => {setCourse(e.target.value)}}/>
      <input type="text" id="assignment" placeholder="assignment details"  onChange={(e) => {setAssignment(e.target.value)}}/>
      <input type="date" id="duedate"  onChange={(e) => {setDate(e.target.value)}}/>
      <input type="time" id="duetime" placeholder="23:59" onChange={(e) => {setTime(e.target.value)}} />
      <button type="submit">submit</button>
    </form>
      <br/>

      <table id="homework-table">
        <tbody>
          <tr>
            <th>Course</th>
            <th>Assignment</th>
            <th>Due Date</th>
            <th>Due Time</th>
          </tr>
          { todos.map( (todo,i) => <tr><td>{todo.course}</td> <td>{todo.assignment}</td> <td>{ todo.duedate }</td> <td>{ todo.duetime }</td></tr> ) }
        </tbody>
      </table> 
    </div>
  )}


export default App;