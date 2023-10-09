import { useState, useEffect } from "react";
import { TopBar } from "./components/TopBar";
import { Contact } from "./components/Contact";

const App = () => {
  const [contacts, setContacts] = useState([ ]);


  useEffect(() => {
    fetch('/docs')
      .then(response => response.json())
      .then(json => {
        setContacts(json)
      })
  }, [])

  async function editContact(id) {
    const response = await fetch("/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: id,
        editFirstName: document.getElementById("editFirstName").value,
        editLastName: document.getElementById("editLastName").value,
        editPhone: document.getElementById("editPhone").value,
        editEmail: document.getElementById("editEmail").value,
        editDateOfBirth: document.getElementById("editDateOfBirth").value,
        editStreetAddress: document.getElementById("editStreetAddress").value,
        editCity: document.getElementById("editCity").value,
        editState: document.getElementById("editState").value,
        editZipCode: document.getElementById("editZipCode").value,
      }),
    });
  };

  async function addContact() {
    // Get the data from the form
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const dateOfBirth = document.getElementById("dateOfBirth").value;
    const streetAddress = document.getElementById("streetAddress").value;
    const city = document.getElementById("city").value;
    const state = document.getElementById("state").value;
    const zipCode = document.getElementById("zipCode").value;

    // POST the data to the server
    const response = await fetch("/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        phone,
        email,
        dateOfBirth,
        streetAddress,
        city,
        state,
        zipCode,
      }),
    }).then((res) => res.json()).then((data) => {
        setContacts({ data });
    });
  }

  
  async function removeContact() {
    // hide the component
    const response = await fetch("/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: this.props.id }),
    }).then((response) => response.json()).then((data) => {
      setContacts({ data });
    });
  }

  async function showEditForm(contact) {
    // Update the form inputs
    document.getElementById("editFirstName").value = contact.firstName;
    document.getElementById("editLastName").value = contact.lastName;
    document.getElementById("editPhone").value = contact.phone;
    document.getElementById("editEmail").value = contact.email;
    document.getElementById("editDateOfBirth").value = contact.dateOfBirth;
    document.getElementById("editStreetAddress").value = contact.streetAddress;
    document.getElementById("editCity").value = contact.city;
    document.getElementById("editState").value = contact.state;
    document.getElementById("editZipCode").value = contact.zipCode;
    document.getElementById("editSubmitButton").onclick = function () {
      editContact(contact.id);
    };

    // Show the form
    const form = document.getElementById("editForm");
    form.classList.remove("hidden");
    // blur the contact list
    const list = document.getElementById("contactList");
    list.classList.add("blur-page");
  }

  return (
    <>
      <div id="parent-div">
        <TopBar />
        <ul>
          {contacts.map((contact, i) => (
            <Contact
              id = {contact.id}
              firstName={contact.firstName}
              lastName={contact.lastName}
              phone={contact.phone}
              email={contact.email}
              dateOfBirth={contact.dateOfBirth}
              streetAddress={
                contact.streetAddress +
                ", " +
                contact.city +
                ", " +
                contact.state +
                ", " +
                contact.zipCode
              }
              lastEdited={contact.lastEdited + " day(s) ago"}
              onclick={removeContact}
            />
          ))}
        </ul>
      </div>
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
            <button id="editSubmitButton" className="createButton">
              Save
            </button>
            <a id="cancelEditButton" href="/contacts" className="createButton">
              Cancel
            </a>
          </div>
        </div>
      </form>
    </>
  );
}
export default App;
