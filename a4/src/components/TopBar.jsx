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
      </div>
    );
  }

}
