import React from 'react'
import './App.css'

class App extends React.Component {
  constructor( props ) {
    super( props )
    this.state = {palettes:[]}
    this.load();
  }

  load() {
    fetch('/getAll', {method:'GET'})
    .then(response => response.json())
    .then(json => {
      this.setState({palettes:json});
    });
  }
  render() {
    return (
      <>
        <form id="colorForm">
              <input type="text" id="name" placeholder="Palette Name..." aria-label="Name" ref={node => (this.name = node)}/>
              <input type="text" id="primary_color" placeholder="#000000" aria-label="Color 1" ref={node => (this.primary_color = node)}/>
              <input type="text" id="secondary_color" placeholder="#000000" aria-label="Color 2" ref={node => (this.secondary_color = node)} />
              <input type="text" id="teritary_color" placeholder="#000000" aria-label="Color 3" ref={node => (this.teritary_color = node)} />
              <input type="text" id="accent_1" placeholder="#000000" aria-label="Color 4" ref={node => (this.accent_1 = node)} />
              <input type="text" id="accent_2" placeholder="#000000" aria-label="Color 5" ref={node => (this.accent_2 = node)} />
              <button id="submit" type="button"  onClick={this.handleSubmit}>submit</button>
          </form>
          <table>
            <tbody>
            {this.state.palettes.map( (e) => <Palette app ={this} id = {e._id} name={e.name} primary_color={e.primary_color} secondary_color={e.secondary_color} teritary_color={e.teritary_color} accent_1={e.accent_1} accent_2={e.accent_2} />)}
            </tbody>
          </table>
      </>
    )
  }
  delete = async (e,id) => {
     await fetch(`/remove/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
    window.location.reload();
  }
  handleSubmit = async (e) => {
    e.preventDefault();
    const colorName = this.name.value;
    const color1 = this.primary_color.value;
    const color2 = this.secondary_color.value;
    const color3 = this.teritary_color.value;
    const color4 = this.accent_1.value;
    const color5 = this.accent_2.value;
    if (colorName === "") {
        alert("Palette must have a name");
        return;
    }
    let json = { name: colorName, primary_color: color1, secondary_color: color2, teritary_color: color3, accent_1: color4, accent_2: color5 };
    const response = await fetch('/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json)
    });
    document.getElementById("colorForm").reset();
    window.location.reload();
  }
}
class Palette extends React.Component {
  submitEdit = async (e) => {
    e.preventDefault();
    const colorName = this.name.value;
    const color1 = this.primary_color.value;
    const color2 = this.secondary_color.value;
    const color3 = this.teritary_color.value;
    const color4 = this.accent_1.value;
    const color5 = this.accent_2.value;
    if (colorName === "") {
        alert("Palette must have a name");
        return;
    }
    let json = { name: colorName, primary_color: color1, secondary_color: color2, teritary_color: color3, accent_1: color4, accent_2: color5 };
    const response = await fetch('/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json)
    });
    document.getElementById("editForm").reset();
    window.location.reload();
  }
  render() {
    const pc = {
      backgroundColor: this.props.primary_color,
    };
    const sc = {
      backgroundColor: this.props.secondary_color,
    };
    const tc = {
      backgroundColor: this.props.teritary_color,
    };
    const a1 = {
      backgroundColor: this.props.accent_1,
    };
    const a2 = {
      backgroundColor: this.props.accent_2,
    }
   
    return <>
    <tr>
      <td><button onClick={(e)=>{this.props.app.delete(e,this.props.id)}}>delete</button></td>
      <td>{this.props.name}</td>
      <td style={pc}>{this.props.primary_color}</td>
      <td style={sc}>{this.props.secondary_color}</td>
      <td style={tc}>{this.props.teritary_color}</td>
      <td style={a1}>{this.props.accent_1}</td>
      <td style={a2}>{this.props.accent_2}</td>
    </tr>
    </>
    
  }
}

export default App
