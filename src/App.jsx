import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [bucketList, setBucketList] = useState([]);
  const [newAction, setNewAction] = useState("");

  const Submit = async (event) => {
    event.preventDefault();
    
    // const newItem = {
    //     action: newAction,
    //     date: new Date(),
    //     complete: "No",
    //     dateCompleted: "Incomplete",
    // };
    
    // setBucketList(bucketList.concat(newItem));
    // setNewAction('');

    const response = await fetch( '/add', {
      method:'POST',
      body: JSON.stringify({action: newAction}),
      headers: { 'Content-Type': 'application/json' }
    })

    const updatedList = await response.json();
    setBucketList(updatedList);
    setNewAction('');
  };

  const Complete = async (index) => {
    // const updatedList = bucketList.slice();
    // const item = updatedList[index];
    //  if (item.complete === "No") {
    //     item.complete = "Yes"
    //     item.dateCompleted = new Date().toLocaleString()
    // } else {
    //     item.complete = "No"
    //     item.dateCompleted = "Incomplete"
    // }
    // setBucketList(updatedList);

    const response = await fetch( '/change', {
      method:'POST',
      body: JSON.stringify({action: "complete", index: index}),
      headers: { 'Content-Type': 'application/json' }
    })

    const updatedList = await response.json();
    setBucketList(updatedList);
  };

  const Delete = async (index) => {
    // const updatedList = bucketList.slice();
    // updatedList.splice(index, 1);
    // setBucketList(updatedList);

    const response = await fetch( '/change', {
      method:'POST',
      body: JSON.stringify({action: "delete", index: index}),
      headers: { 'Content-Type': 'application/json' }
    })

    const updatedList = await response.json();
    setBucketList(updatedList);
  };

  return (
    <>
      <div className="App">
      <h1>Bucket List</h1>
      <form onSubmit={Submit}>
        <input
          type="text"
          value={newAction}
          onChange={(e) => setNewAction(e.target.value)}
          placeholder="ex: Climb Mt. Everest"
        />
        <button type="submit">Submit</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Action</th>
            <th>Date Created</th>
            <th>Completed</th>
            <th>Date Completed</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {bucketList.map((item, index) => (
            <tr key={index}>
              <td>{item.action}</td>
              <td>{new Date(item.date).toLocaleString()}</td>
              <td>
                <button onClick={() => Complete(index)}>{item.complete}</button>
              </td>
              <td>{item.dateCompleted}</td>
              <td>
                <button onClick={() => Delete(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  )
}

export default App
