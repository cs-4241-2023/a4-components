import React from "react";

export class Contact extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <li class="contact-card">
        <div class="contact-card-header">
          <div class="name-div">
            <h3 class="contact-name" id="cardFirstName">
              {props.firstName}
            </h3>
            <h3 class="contact-name" id="cardLastName">
              {props.lastName}
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
                {props.phone}
              </td>
              <td id="tableEmail" width="20%">
                {props.email}
              </td>
              <td id="tableDateOfBirth" width="12%">
                {props.dateOfBirth}
              </td>
              <td id="tableStreetAddress" width="25%">
                {props.streetAddress}
              </td>
              <td id="tableLastEdited" width="12%">
                {props.lastEdited}
              </td>
            </tr>
          </tbody>
        </table>
        <div id="icon-div" class="icon-div">
          <button class="btn" id="editButton">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn" id="deleteButton">
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </li>
    );
  }
}
