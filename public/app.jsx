import React, { useState, useEffect } from 'react'

const Todo = props => (
  <tr> 
    <td>{props.course}</td>
    <td>{props.assignment}</td>
    <td>{props.duedate}</td>
    <td>{props.duetime}</td>
    <td><input type="checkbox" defaultChecked={props.completed} onChange={ e => props.onclick( props.name, e.target.checked ) }/></td>
  </tr>
)

const App = () => {
  const [todos, setTodos] = useState([ ]) 

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
      setEntries( json )
    })
  }
  
  app.post( '/delete', function( req,res ) {
  appdata.splice(req.body.index, 1)
  
  res.json( appdata )
})
  
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
    <h1 class="center">Homework Tracker</h1>
    <p>add your upcoming assignment:<p>
    <form id="homework">
      <input type="text" id="course" placeholder="course"/>
      <input type="text" id="assignment" placeholder="assignment details"/>
      <input type="date" id="duedate"/>
      <input type="time" id="duetime" value="23:59"/>
      <button type="submit">submit</button>
    </form>
      <br/>

      <table>
        <tbody>
          <tr>
            <th>Course</th>
            <th>Assignment</th>
            <th>Due Date</th>
            <th>Due Time</th>
          </tr>
          { entries.map( (entry,i) => <Entry key={i} course={entry.course} assignment={entry.assignment} duedate={ entry.duedate } duetime={ entry.duetime }/> ) }
        </tbody>
      </table> 
    </div>
  )


export default App