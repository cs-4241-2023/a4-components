
import React from "react";
import { Component } from "react";
import { useState, useEffect, useRef } from "react";
import './App.css';

// Main Idea
// Create a new component called VehicleServiceLogList (takes an array of JSON as props)
// returns all the rows

// App will have a useState on serviceLogs
// we will pass serviceLogs into component we create to display it onto our page

const VehicleServiceLog = ({ serviceLog, removeEntry, handleModify }) => {
  return (
    <tr>
      <td>{serviceLog.year}</td>
      <td>{serviceLog.car_make}</td>
      <td>{serviceLog.model}</td>
      <td>{serviceLog.service_type}</td>
      <td>{serviceLog.appointment_date}</td>
      <td>{serviceLog.day_until_appointment}</td>
      <td>{serviceLog.uuid}</td>
      <td>
        {/* Add action buttons or links here, e.g., modify and remove */}
        <button className="md-table-btn" onClick={() => handleModify(serviceLog.uuid)}>Modify</button>
      </td>
      <td>
        <button className="rm-table-btn" onClick={() => removeEntry(serviceLog.uuid)}>Remove</button>
      </td>
    </tr >
  );
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      year: "",
      car_make: "",
      model: "",
      service_type: "",
      appointment_date: "",
      serviceLogs: []
    };
    // this.logState = { serviceLogs: [] };
    this.load();
    this.submit = this.submit.bind(this);
    this.removeEntry = this.removeEntry.bind(this);
    this.handleModify = this.handleModify.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.formRef = React.createRef();

  }

  load = async () => {
    try {
      const response = await fetch('/req-server-data', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const json = await response.json();
      console.log("Current Server Service Logs");
      console.log(json);

      // Update the state after successful fetch
      this.setState({ serviceLogs: json });
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  handleInputChange = (event) => {
    const { id, value } = event.target;
    this.setState({ [id]: value });
  };

  removeEntry = async (UUID) => {
    try {
      const response = await fetch('/delete-frm-table', {
        method: 'POST',
        body: UUID,
      });

      if (response.ok) {
        console.log(`Data ${UUID} was removed`);
        await this.load();
        console.log("Client Service logs from client side after removal");
        console.log(this.state.serviceLogs);
      } else {
        console.error(`Failed to remove data ${UUID}`);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  handleModify = async (uuid) => {
    let form_data = this.user_form_data();
    if (form_data !== "") {
      this.modifyEntry(uuid, form_data);
    } else {
      this.handleValidationError();
    }
  }

  modifyEntry = async (UUID, user_data) => {
    const req_data = [];

    req_data.push(UUID);
    req_data.push(user_data);

    console.log("Post Req Data Frm Modify: ");
    console.log(req_data);

    try {
      const response = await fetch('/modify-table-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(req_data),
      });

      if (response.ok) {
        console.log(`Data ${UUID} was modified`);
        this.clearForm();
        await this.load();
        console.log("Client Service logs from client side after modification");
        console.log(this.state.serviceLogs);
      } else {
        console.error(`Failed to modify data ${UUID}`);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  submit = async (event) => {
    event.preventDefault();
    const body = this.user_form_data();
    console.log(body);

    console.log("Client Service logs before addition");
    console.log(this.state.serviceLogs);

    console.log("Data being added to the table: " + body);
    if (body !== "") {
      this.clearForm();
      try {
        const response = await fetch('/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
          },
          body
        });
        const responseData = await response.text()
        await this.load();
        console.log("Client Service logs from client side after addition");
        console.log(this.state.serviceLogs);
        // this.build_table();
        console.log('Post Request Status:', responseData)
      } catch (error) {
        console.error('Error submitting data:', error);
      }
    } else {
      this.handleValidationError();
    }
  };

  handleValidationError() {
    if (!(this.validateYear())) {
      alert("Please enter a valid year");
    } else {
      alert("Please fill out all fields");
    }
  }

  clearForm() {
    const currentForm = this.formRef.current;
    currentForm.reset();
    this.setState({
      year: "",
      car_make: "",
      model: "",
      service_type: "",
      appointment_date: "",
    });
    console.log("Form cleared");
  }

  user_form_data = () => {
    if (this.validate_form_input()) {
      const user_vehicle_json_data = {
        year: this.state.year,
        car_make: this.state.car_make,
        model: this.state.model,
        service_type: this.state.service_type,
        appointment_date: this.state.appointment_date,
      }
      let body_val = JSON.stringify(user_vehicle_json_data)
      return body_val;
    } else {
      return "";
    }
  }

  validate_form_input = () => {
    const inputs = [this.state.year, this.state.car_make, this.state.model, this.state.service_type, this.state.appointment_date];
    for (const input of inputs) {
      if (input === "") {
        return false;
      }
    }
    // Add additional validation checks here for the different input fields
    if (this.validateYear()) {
      return true;
    }
    return false;
  }

  validateYear = () => {
    // Check if the input is a 4-digit number using a regular expression
    var yearPattern = /^\d{4}$/;

    if (yearPattern.test(this.state.year)) {
      return true
    } else {
      return false;
    }
  }

  render() {
    return (
      <div className="App">
        <div className="main-header">
          <p className="header-text">Vehicle Service Log Book React</p>
          <img className="motor-sports-logo" alt="bmw m logo" src="https://logos-world.net/wp-content/uploads/2022/03/BMW-M-Emblem.png" />
        </div>

        <div className="main-container">
          <div className="row-content">
            <form id="user-inputs" className="main-form" ref={this.formRef} onSubmit={this.submit}>

              <div className="input-text-container">
                <label htmlFor="year">Year:</label>
                <input className="form__input" type="text" placeholder="Ex: 2014" id="year" value={this.state.year}
                  onChange={this.handleInputChange} required />
              </div>

              <div className="input-text-container" id="make">
                <label htmlFor="car_make">Make:</label>
                <input className="form__input" type="text" placeholder="Ex: BMW" id="car_make" value={this.state.car_make}
                  onChange={this.handleInputChange} required />
              </div>

              <div className="input-text-container">
                <label htmlFor="model">Model:</label>
                <input className="form__input" type="text" placeholder="Ex: 335i xDrive" id="model" value={this.state.model}
                  onChange={this.handleInputChange} required />
              </div>

              <div className="input-text-container">
                <label htmlFor="service-type">Service Type:</label>
                <input className="form__input" type="text" placeholder="Ex: Oil Change" id="service_type" value={this.state.service_type}
                  onChange={this.handleInputChange} required />
              </div>

              <div className="input-text-container">
                <label htmlFor="appointment_date">Appointment Date:</label>
                <input className="form__input" type="date" id="appointment_date" value={this.state.appointment_date}
                  onChange={this.handleInputChange} required />
              </div>

              <div className="buttons-container">
                <button type="submit" id="submit">Submit</button>
                <button type="reset" id="clear">Clear</button>
              </div>
            </form>

            <div id="middle-line"></div>

            <div className="instruction-info">
              <p>Instructions</p>
              <div className="list-container">
                <ul className="unordered-list">
                  <li className="first-item">
                    <strong className="add-instruction">To add an appointment: </strong>Fill out the form completely and click the
                    'Submit' button.
                  </li>
                  <li className="second-item">
                    <strong className="modify-instruction">To modify an appointment: </strong> Fill out the form with new info and
                    then click the
                    'Modify' button for the
                    vehicle appointment you want to update.
                  </li>
                  <li className="third-item">
                    <strong className="remove-instruction">To remove an appointment: </strong>Click the 'Remove' button for the
                    vehicle appointment you want to remove.
                  </li>
                </ul>
              </div>
            </div>

          </div>

          <div className="table-container">
            <table id="myTable" className="vehicle-table">
              <caption
                style={{
                  borderRadius: '20px',
                  border: '1px solid black',
                  marginTop: '20px',
                  marginBottom: '20px',
                  padding: '5px',
                }}
              >
                Vehicle Appointments
              </caption>
              <tbody>
                <tr>
                  <th>Year</th>
                  <th>Make</th>
                  <th>Model</th>
                  <th>Service Type</th>
                  <th>Appointment Date</th>
                  <th>Days Until Appointment</th>
                  <th>UUID</th>
                  <th>Action 1</th>
                  <th>Action 2</th>
                </tr>

                {this.state.serviceLogs.map((serviceLog) => (
                  <VehicleServiceLog key={serviceLog.uuid} serviceLog={serviceLog} removeEntry={this.removeEntry} handleModify={this.handleModify} />
                ))}
              </tbody>
            </table>
          </div>
          {/* <!-- End of table-container tag --> */}
          <div className="empty-table-text">
            <p id="empty-text">
              {/* <!-- Appointment list is EMPTY. Go ahead and add an appointment! --> */}
            </p>
          </div>
        </div>
        {/* <!--End of main container tag--> */}
      </div>
    );
  }
}

export default App;
