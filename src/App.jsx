
import React from "react";
import './App.css';

// Main Idea
// Create a new component called VehicleServiceLogList (takes an array of JSON as props)
// returns all the rows

// App will have a useState on serviceLogs
// we will pass serviceLogs into component we create to display it onto our page


class App extends React.Component {

  // Create a constructor, which has serviceLogs array as useState

  // You can define functions here 
  // Submit
  // Delete
  // Modify
  // BuildTable

  render() {
    return (
      <div className="App">
        <div className="main-header">
          <p className="header-text">Vehicle Service Log Book React</p>
          <img className="motor-sports-logo" alt="bmw m logo" src="https://logos-world.net/wp-content/uploads/2022/03/BMW-M-Emblem.png" />
        </div>

        <div className="main-container">
          <div className="row-content">
            <form id="user-inputs" className="main-form">

              <div className="input-text-container">
                <label htmlFor="year">Year:</label>
                <input className="form__input" type="text" placeholder="Ex: 2014" id="year" required />
              </div>

              <div className="input-text-container" id="make">
                <label htmlFor="car_make">Make:</label>
                <input className="form__input" type="text" placeholder="Ex: BMW" id="car_make" required />
              </div>

              <div className="input-text-container">
                <label htmlFor="model">Model:</label>
                <input className="form__input" type="text" placeholder="Ex: 335i xDrive" id="model" required />
              </div>

              <div className="input-text-container">
                <label htmlFor="service-type">Service Type:</label>
                <input className="form__input" type="text" placeholder="Ex: Oil Change" id="service-type" required />
              </div>

              <div className="input-text-container">
                <label htmlFor="appointment-date">Appointment Date:</label>
                <input className="form__input" type="date" id="appointment-date" required />
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
