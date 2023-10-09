import React from "react";
import TopBar from "../components/TopBar";
import Contact from "../components/Contact";

export default function Contacts() {
  var storedContacts = [];

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
    });
    console.log("ADDED TO DATABASE");
    // Update the table
    updateContacts();
    console.log("Updating contact list");
  }

  async function removeContact(id) {
    // POST the data to the server
    const response = await fetch("/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: id }),
    });

    // Update the table
    updateContacts();
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
      editContact(contact._id);
    };

    // Show the form
    const form = document.getElementById("editForm");
    form.classList.remove("hidden");
    // blur the contact list
    const list = document.getElementById("contactList");
    list.classList.add("blur-page");
  }

  const editContact = async function (id) {
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

  const daysUntilBirthday = function () {
    const today = new Date();
    const daysRemaining = Math.ceil(
      (this.birthday - today) / (1000 * 60 * 60 * 24)
    );
    return daysRemaining;
  };

  return (
    <>
      <div id="parent-div">
        <TopBar />
        <ul id="contactList" className="contact-list" />
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
              id="submitButton"
              className="createButton"
              onClick={(e) => addContact()}
            >
              Create
            </button>
            <a id="cancelButton" href="/contacts" className="createButton">
              Cancel
            </a>
          </div>
        </div>
      </form>
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
};