import React from "react";

export class Contact extends React.Component {
  constructor(props) {
    super(props);
  }

  showEditForm() {
    // Update the form inputs
    document.getElementById("editFirstName").value = this.props.firstName;
    document.getElementById("editLastName").value = this.props.lastName;
    document.getElementById("editPhone").value = this.props.phone;
    document.getElementById("editEmail").value = this.props.email;
    document.getElementById("editDateOfBirth").value = this.props.dateOfBirth;
    document.getElementById("editStreetAddress").value = this.props.streetAddress;
    document.getElementById("editCity").value = this.props.city;
    document.getElementById("editState").value = this.props.state;
    document.getElementById("editZipCode").value = this.props.zipCode;
    document.getElementById("editSubmitButton").onclick = function () {
      editContact(this.props.id);
    };

    // Show the form
    const form = document.getElementById("editForm");
    form.classList.remove("hidden");

  }

  submitForm() {
    const json = JSON.stringify({
      id: this.props.id,
      firstName: document.getElementById("editFirstName").value,
      lastName: document.getElementById("editLastName").value,
      phone: document.getElementById("editPhone").value,
      email: document.getElementById("editEmail").value,
      dateOfBirth: document.getElementById("editDateOfBirth").value,
      streetAddress: document.getElementById("editStreetAddress").value,
      city: document.getElementById("editCity").value,
      state: document.getElementById("editState").value,
      zipCode: document.getElementById("editZipCode").value,
    });
    this.props.onSubmitEdit(json);
  }

  render() {
    return (
      <div>
        <form id="editForm" className="hidden popup-form">
          <h3>Edit Contact</h3>
          <hr />
          <div className="form-spacer">
            <div className="flex-row">
              <div>
                <h5>Name</h5>
                <input
                  type="text"
                  name="editFirstName"
                  id="editFirstName"
                  placeholder="First Name (John)"
                />
                <input
                  type="text"
                  name="editLastName"
                  id="editLastName"
                  placeholder="Last Name (Doe)"
                />
              </div>
              <div>
                <h5>Contact Info</h5>
                <input
                  type="text"
                  name="editPhone"
                  id="editPhone"
                  placeholder="Phone (123-456-7890)"
                />
                <input
                  type="text"
                  name="editEmail"
                  id="editEmail"
                  placeholder="Email (jdoe@gmail.com)"
                />
              </div>
            </div>
            <h5>Date of Birth</h5>
            <input
              type="date"
              name="editDateOfBirth"
              id="editDateOfBirth"
              placeholder="Birthday"
            />
            <h5>Address</h5>
            <input
              type="text"
              name="editStreetAddress"
              id="editStreetAddress"
              placeholder="Street Address (123 Main St)"
            />
            <input
              type="text"
              name="editCity"
              id="editCity"
              placeholder="City (Boston)"
            />
            <input
              type="text"
              name="editState"
              id="editState"
              placeholder="State (MA)"
            />
            <input
              type="text"
              name="editZipCode"
              id="editZipCode"
              placeholder="Zip (02108)"
            />
            <hr />
            <div className="form-section-1">
              <button
                id="editSubmitButton"
                className="createButton"
                onClick={(e) => this.submitForm()}
              >
                Save
              </button>
              <a
                id="cancelEditButton"
                href="/contacts"
                className="createButton"
              >
                Cancel
              </a>
            </div>
          </div>
        </form>
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
                  {this.props.streetAddress + ", " + this.props.city + ", " + this.props.state + " " + this.props.zipCode}
                </td>
                <td id="tableLastEdited" width="12%">
                  {this.props.lastEdited}
                </td>
              </tr>
            </tbody>
          </table>
          <div id="icon-div" className="icon-div">
            <button
              className="btn"
              id="editButton"
              onClick={(e) => this.showEditForm()}
            >
              <i className="fa-solid fa-pen-to-square"></i>
            </button>
            <button
              className="btn"
              id="deleteButton"
              onClick={(e) => this.props.onRemove(this.props.id)}
            >
              <i className="fa fa-trash"></i>
            </button>
          </div>
        </li>
      </div>
    );
  }
}
