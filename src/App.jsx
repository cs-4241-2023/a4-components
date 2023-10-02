import React from 'react'
import { useState } from 'react'
import UserRow from './UserRow'

class App extends React.Component {
    constructor( props ) {
      super( props )
      this.state = { users:[] }
      this.getUsers()
  }

    getUsers() {
        fetch('/getUsers')
            .then( response => response.json() )
            .then( json => {
                this.setState({ users:json})
            })
    }

    submit = async ( event ) => {

      event.preventDefault()
      
      const json = { 'name': this.firstname.value, 'lastname': this.lastname.value, 'type': this.type.value, 'dept': this.dept.value, 'pass': "Default Password"} //whatever: "whatever" },
      console.log(json);
      const body = JSON.stringify( json )
      
      const form = document.querySelector('form')

      fetch( '/newUser', {
        method:'POST',
        body
      }).then(form.reset())
      .then(window.location.reload());
      
    }

    render(){
      //return <div><UserRow></UserRow><UserRow></UserRow></div>
      return <div>    
        <header>
      <h1>User Database</h1>
    </header>
    <div class="mui-container">
      <div>
          <form class="mui-form" method="post">
              <p>
                Create New User:
              </p>
              <div class="mui-textfield mui-textfield--float-label">
              <input type="text" id="name" name="user_name"required="required"ref={node => (this.firstname = node)}/>
                <label for="name">First Name:</label>
              </div>
              <div class="mui-textfield mui-textfield--float-label">
              <input type="text" id="lastname" name="user_lastname"required="required"ref={node => (this.lastname = node)}/>
                <label for="email">Last Name:</label>
              </div>
              {/* <div class="mui-textfield mui-textfield--float-label">
                <input type="password" id="password" name="user_pass"required="required"ref={node => (this.pass = node)}/>
                <label for="pass">Password:</label>
              </div> */}
                <label for="type">Type:</label>
                <select name="text" id="type"ref={node => (this.type = node)}>
                  <option value="Undergrad Student">Undergrad Student</option>
                  <option value="Graduate Student">Graduate Student</option>
                  <option value="Professor"> Professor</option>
                  <option value="Systems Admin">Systems Admin</option>
                </select>     
                <label for="department">Department:</label>
                <select name="text" id="dept"ref={node => (this.dept = node)}>
                  <option value="All">Any/All</option>
                  <option value="CS">Computer Science</option>
                  <option value="IMGD">Interactive Media and Game Design</option>
                  <option value="CHE">Chemical Engineering</option>
                  <option value="ECE">Electrical and Computer Engineering</option>
                  <option value="RBE">Robotics Engineering</option>
                  <option value="CE">Civil Engineering</option>
                  <option value="ME">Mechanical Engineering</option>
                  <option value="CH">Chemistry</option>
                  <option value="PH">Physics</option>
                  <option value="MA">Math</option>
                  <option value="AR">Art</option>
                  <option value="HI">History</option>
                  <option value="HUA">Humanities and Arts</option>
                  <option value="MU">Music</option>
                </select>         
                <button class="mui-btn mui-btn--raised"id="submitButton"onClick={this.submit}>Create new user</button>
          </form>
          <div class="mui-panel">
            <div class="mui-container">
            <p>----------------------------------------------------------- REGISTERED USERS ----------------------------------------------------------- </p>
              <table class="mui-table mui-table--bordered" id="usertable">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>User Type</th>
                    <th>Dept.</th>
                  </tr>
                  { this.state.users.map((user,i) => <UserRow key={i} app={this} user={user} id={user._id} name={user.name} email={user.email} type={user.type} dept={user.dept} /> ) }
                </thead>
                <tbody id="usertablebody">
                </tbody>
              </table>
              </div>
      </div>
        </div></div></div>
    }
}

export default App;