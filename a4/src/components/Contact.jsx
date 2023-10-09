import React from "react";

export class Contact extends React.Component {
  constructor(props) {
    super(props);
  }


  async removeContact() {
    // hide the component
    const response = await fetch("/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: this.props.id }),
    }).then((response) => response.json()).then((data) => {
      this.setState({ contacts: data });
    });
  }

  async editContact() {
    // Hide the create contact button
    const button = document.getElementById("createButton");
    button.classList.add("hidden");
    // Show the form
    const form = document.getElementById("contactForm");
    form.classList.remove("hidden");
    // Update the form inputs
    document.getElementById("firstName").value = this.props.firstName;
    document.getElementById("lastName").value = this.props.lastName;
    document.getElementById("phone").value = this.props.phone;
    document.getElementById("email").value = this.props.email;
    document.getElementById("dateOfBirth").value = this.props.dateOfBirth;
    document.getElementById("streetAddress").value = this.props.streetAddress;
    document.getElementById("city").value = this.props.city;
    document.getElementById("state").value = this.props.state;
    document.getElementById("zipCode").value = this.props.zipCode;
    document.getElementById("id").value = this.props.id;

    // send the edit request
    fetch
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
            <button className="btn" id="deleteButton" onClick={(e) => this.removeContact()}>
              <i className="fa fa-trash"></i>
            </button>
          </div>
        </li>
      </React.Fragment>
    );
  }
}
