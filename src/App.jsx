import React from 'react'

class Record extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.name}</td>
        <td>{this.props.score}</td>
        <td>{this.props.date}</td>
      </tr>
    )
  }
}

class Leaderboard extends React.Component {
  render() {
    return (
      <div className="score_table">
        <p className="thick">Leaderboard:</p>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Score</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {this.props.records.map( (record, i) => {
              return (<Record key={i} name={record.name} score={record.score} date={record.date} />)
            } )}
          </tbody>
        </table>
      </div>
    )
  }
}

class Title extends React.Component {
  render() {
    return (
      <div className="title">
        <h1>
          David's Most Subway Stops in One Hour
        </h1>
        <p>
          Submit the number of subway stops you have been to in one hour to be recognized on this leaderboard!
        </p>
      </div>
    )
  }
}

class Instructions extends React.Component {
  render() {
    return (
      <div className="manual_score_text">
        <p className="thick">Manually Submit Score:</p>
        <p>To change your score, simply use the same name as your original score with a new value to change it.</p>
        <p>To delete your score, use your same name, then set the score to a negative value</p>
      </div>
    )
  }
}

class Form extends React.Component {
  render() {
    return (
      <div className="manual_score_form">
        <form>
          <label htmlFor="yourname">Name: </label>
          <input type="text" id="yourname" placeholder="name" /> <br/>
          <label htmlFor="score">Score: </label>
          <input type="text" id="score" placeholder="score" /> <br/>
          <button onClick={e => this.submit(e)}>Submit</button>
          <button onClick={e => this.refresh(e)}>Refresh</button>
        </form>
      </div>
    )
  }

  submit(ev) {
    ev.preventDefault()

    this.props.onSubmission()
  }

  refresh(ev) {
    ev.preventDefault()
    
    this.props.onRefresh()
  }
}

class Grid extends React.Component {
  constructor(props) {
    super(props)

    this.state = {records:[]}

    this.submit = this.submit.bind(this)
    this.load = this.load.bind(this)

    window.onload = this.load
  }

  load() {
    fetch('/refresh', {method:'get', 'no-cors':true})
      .then(response => response.json())
      .then(json => {
        this.setState({records: json})
      })
  }

  render() {
    return (
      <div className="grid_container">
        <Title />
        <Instructions />
        <Leaderboard records={this.state.records} />
        <Form onRefresh={this.load} onSubmission={this.submit}/>
      </div>
    )
  }

  submit() {
    const input_name = document.querySelector( '#yourname' ),
          input_score = document.querySelector( '#score' ),
          json = { yourname: input_name.value, score: input_score.value },
          body = JSON.stringify( json );
    
    fetch('/submit', {
      method: 'POST',
      body: body,
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(json => {
        this.setState({records: json})
      }, err => {
        alert("You can only put a number as your score!")
      })
  }
   
}

export default Grid;