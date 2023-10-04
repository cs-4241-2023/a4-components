import React from 'react'
import './index.css'
class Library extends React.Component {
  // our .render() method creates a block of HTML using the .jsx format


  render() {
    const { item } = this.props
    const itemID = item.identifier
    return (

      <ul>
        <li> <strong>Title:</strong> {item.title}</li>
        <li><strong>Author:</strong> {item.author}</li>
        <li><strong>Start Date:</strong> {item.startDate}</li>
        <li> <strong>Date Finished:</strong> {item.dateFinished} </li>
        <li> <strong>Time to Finish:</strong> {item.timeToFinish}</li>
        <button id="delete" onClick={() => this.props.onDelete(itemID)}> delete </button>
      </ul>
    )
  }

}

// main component
class App extends React.Component {
  constructor(props) {
    super(props)
    // initialize our state
    this.state = {
      title: '',
      author: '',
      startDate: '',
      dateFinished: '',
      timeToFinish: '',
      identifier: '',
      appdata: [],
    }


  }

  // load in our data from the server


  //start and end must be passed as Date() objects
  calcTime = async (start, end) => {

    const timeDif = end - start
    const msDay = 24 * 60 * 60 * 1000
    const msMonth = 30.44 * msDay
    const msYear = 365.25 * msDay

    const years = Math.floor(timeDif / msYear)
    const remainingTimeAfterYears = timeDif % msYear

    const months = Math.floor(remainingTimeAfterYears / msMonth)
    const remainingTimeAfterMonths = remainingTimeAfterYears % msMonth
    const days = Math.floor(remainingTimeAfterMonths / msDay)

    const formattedTime = `${years} Year(s), ${months} Month(s), ${days} Day(s)`
    return formattedTime
  }

  delete = async (itemID) => {
    console.log("Delete book...")
    console.log(itemID)


    try {
      const response = await fetch(`/delete/${itemID}`, {
        method: 'DELETE',
      })

      console.log(`/delete/${itemID}`)
      console.log("Response status:", response.status)

      if (response.status === 200) {
        // Successful deletion, update the appdata state by removing the deleted item
        this.setState((prevState) => ({
          appdata: prevState.appdata.filter((item) => item.identifier !== itemID),
        }));
        console.log('Deleted the item with ID:', itemID)
      } else {
        console.error("Error deleting item on server")
      }
    } catch (error) {
      console.error('Failed to delete item:', error)
    }
  }

  add = async (e) => {

    e.preventDefault()

    // Get the input values
    const { title, author, startDate, dateFinished } = this.state;

    // Check if all input fields are filled
    if (!title.trim() || !author.trim() || !startDate || !dateFinished) {
      console.log('Please fill in all fields')
      return;
    }


    const ttFinish = await this.calcTime(new Date(startDate), new Date(dateFinished))

    // Create a new library item
    const newItem = {
      title: title,
      author: author,
      startDate: startDate,
      dateFinished: dateFinished,
      timeToFinish: ttFinish,
      identifier: title + author + startDate + dateFinished,
      appdata: this.state.appdata
    }

    console.log(newItem)



    // Update the appdata state by adding the new item




    try {
      fetch('/add', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        'no-cors': true,
        body: JSON.stringify(newItem),
      })
        .then(response => {
          console.log(response)
          if (response.status === 200) {
            this.setState((prevState) => ({
              appdata: [...prevState.appdata, newItem],
            }))
            console.log('Added a new item');

          }
          else if (response.status === 409) {
            console.log('duplicate entry')
          }
          else {

            console.error('Failed to add data to library:', response.statusText)
          }

        })


    }
    catch (error) {
      console.error('Failed to add data to library:', error)
    }

    // Clear the input fields
    this.setState({
      title: '',
      author: '',
      startDate: '',
      dateFinished: '',
    })

  }
  componentDidMount() {
    // Fetch library data from the server and populate appdata
    fetch('/library')
      .then(response => {
        if (response.status === 200) {
          return response.json()
        }
        else {
          throw new Error('Failed to fetch data from the server')
        }
      })
      .then(data => {
        this.setState({ appdata: data })
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }


  // render component HTML using JSX 
  render() {
    return (

      <div className="App">
        <h1>Book Tracker</h1>

        <div className="userInput">


          <form onSubmit={(e) => e.preventDefault()} method="post">
            <div>
              <label htmlFor="title">Enter book title:</label>
              <input
                type="text"
                id="title"
                value={this.state.title}
                onChange={(e) => this.setState({ title: e.target.value })} />
            </div>
            <div>
              <label htmlFor="author">Enter author's name:</label>
              <input
                type="text"
                id="author"
                value={this.state.author}
                onChange={(e) => this.setState({ author: e.target.value })} />

            </div>

            <div>
              <label htmlFor="startDate">Date started:</label>
              <input
                type="date"
                id="startDate"
                value={this.state.startDate}
                onChange={(e) => this.setState({ startDate: e.target.value })} />

            </div>
            <div>
              <label htmlFor="dateFinished">Date completed:</label>
              <input
                type="date"
                id="dateFinished"
                value={this.state.dateFinished}
                onChange={(e) => this.setState({ dateFinished: e.target.value })} />

            </div>
            <div>
              <button id="submit" onClick={(e) => this.add(e)}>
                submit
              </button>

            </div>
          </form>


        </div>
        <h1>My Library</h1>
        {this.state.appdata.length > 0 && ( // Check if appdata is not empty
          <div className="userLibrary">
            <ul>
              {this.state.appdata.map((item, index) => (
                <li key={index}>
                  <Library item={item} onDelete={this.delete} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {this.state.appdata.length === 0 && (
          <p>Your library is empty.</p>
        )}
      </div>


    )
  }
}

export default App;