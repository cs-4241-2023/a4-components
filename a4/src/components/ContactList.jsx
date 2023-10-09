import React from "react";
import { Contact } from "./Contact";

export class ContactList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { contacts: [] };
        this.load();
    }

    load() {
        fetch("/docs", { method: 'get'})
            .then((res) => res.json())
            .then((data) => {
                this.setState({ contacts: data });
            });
        console.log("Contact list with " + this.state.contacts.length + " contacts loaded");
    }

    render() {
      return (
          <div className="contactList">
              {this.state.contacts.map((contact) => (
                  <Contact
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
                  />
              ))}
          </div>
      )
}}
