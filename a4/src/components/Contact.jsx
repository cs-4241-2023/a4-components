import React from "react";

export class Contact extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <li className="contact-card">
          <div className="contact-card-header">
            <div className="name-div">
              <h3 className="contact-name" id="cardFirstName">
                {this.props.firstName}
              </h3>
              <h3 className="contact-name" id="cardLastName">
                {this.props.lastName}
              </h3>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Phone</th>
                <th>Email</th>
                <th>DOB</th>
                <th>Address</th>
                <th>Last Edited</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td id="tablePhone" width="15%">
                  {this.props.phone}
                </td>
                <td id="tableEmail" width="20%">
                  {this.props.email}
                </td>
                <td id="tableDateOfBirth" width="12%">
                  {this.props.dateOfBirth}
                </td>
                <td id="tableStreetAddress" width="25%">
                  {this.props.streetAddress}
                </td>
                <td id="tableLastEdited" width="12%">
                  {this.props.lastEdited}
                </td>
              </tr>
            </tbody>
          </table>
          <div id="icon-div" className="icon-div">
            <button className="btn" id="editButton">
              <i className="fa-solid fa-pen-to-square"></i>
            </button>
            <button className="btn" id="deleteButton">
              <i className="fa fa-trash"></i>
            </button>
          </div>
        </li>
      </React.Fragment>
    );
  }
}
