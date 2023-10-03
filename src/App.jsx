import React, { useState, useEffect } from 'react'

const Entry = props => (
  <tr>
    <td>{props.name}</td>
    <td>{props.age}</td>
    <td>{props.year}</td>
    <td>{props.birthyear}</td>
  </tr>
)

const App = () => {
  const [entries, setEntries] = useState([ ]) 

  function deleteEntry( ) {
    const input1 = document.querySelector('#delete').value
    fetch( '/delete', {
      method:'POST',
      body: JSON.stringify({ index:input1 }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then( response => response.json() )
    .then( json => {
      setEntries( json )
    })
  }

  function submit() {
    const input1 = document.querySelector('#name').value
    const input2 = document.querySelector('#age').value
    const input3 = document.querySelector('#year').value

    fetch( '/submit', {
      method:'POST',
      body: JSON.stringify({ name:input1, age:input2, year:input3 }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then( response => response.json() )
    .then( json => {
      setEntries( json )
    })
  }

  function read() {
    fetch( '/read', {
      method:'GET',
    })
    .then( response => response.json() )
    .then( json => {
      setEntries( json )
    })
  }
    
  useEffect( ()=> {
    document.title = `Birth Year Calculator`
    read()
  })

  return (
    <div className="App">
      <label className="text">Enter your name:</label>
      <input type="text" id="name" defaultValue="" />
      <br/>

      <label className="num">Enter your age at the start of the year:</label>
      <input type="number" id="age" defaultValue="" />
      <br/>

      <label className="num">Enter the current year:</label>
      <input type="number" id="year" defaultValue="" />
      <br/>

      <button onClick={ e => submit()}>submit</button>
      <br/>

      <label className="num">Enter the index of the entry to delete:</label>
      <input type="number" id="delete" defaultValue="0" />
      <br/>

      <button onClick={ e => deleteEntry()}>delete</button>
      <br/>

      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Current Year</th>
            <th>Birth Year</th>
          </tr>
          { entries.map( (entry,i) => <Entry key={i} name={entry.name} age={entry.age} year={ entry.year } birthyear={ entry.birthyear }/> ) }
        </tbody>
      </table> 
    </div>
  )
}

export default App