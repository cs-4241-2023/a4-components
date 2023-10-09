import React from "react";
export class TopBar extends React.Component {

  constructor(props) {
    super(props);
  }
    
  showForm () {
    // Hide the create contact button
    const button = document.getElementById("createButton");
    button.classList.add("hidden");
    // Show the form
    const form = document.getElementById("contactForm");
    form.classList.remove("hidden");
  };

  render() {
    return (
      <div id="contactHeader" className="top-bar">
        <h1>Contacts</h1>
        <div className="flex-row">
          <button
            id="createButton"
            className="createButton"
            onClick={(e) => this.showForm()}
          >
            Create Contact
          </button>
        </div>
        <form id="contactForm" className="hidden popup-form">
          <h3>Create Contact</h3>
          <hr />
          <div className="form-spacer">
            <div className="flex-row">
              <div>
                <h5>Name</h5>
                <input
                  type="text"
                  id="firstName"
                  placeholder="First Name (John)"
                />
                <input type="text" id="lastName" placeholder="Last Name (Doe)" />
              </div>
              <div>
                <h5>Contact Info</h5>
                <input type="text" id="phone" placeholder="Phone 123-456-7890" />
                <input
                  type="text"
                  id="email"
                  placeholder="Email (jdoe@gmail.com)"
                />
              </div>
            </div>
            <h5>Date of Birth</h5>
            <input type="date" id="dateOfBirth" placeholder="Birthday" />
            <h5>Address</h5>
            <input
              type="text"
              id="streetAddress"
              placeholder="Street Address (123 Main St)"
            />
            <input type="text" id="city" placeholder="City (Boston)" />
            <input type="text" id="state" placeholder="State (MA)" />
            <input type="text" id="zipCode" placeholder="Zip (02108)" />
            <hr />
            <div className="form-section-1">
              <button
                className="createButton"
                onClick={(e) => this.props.onCreate()}
              >
                Create
              </button>
              <a id="cancelButton" href="/contacts" className="createButton">
                Cancel
              </a>
            </div>
          </div>
        </form>
      </div>
      
    );
  }

}
