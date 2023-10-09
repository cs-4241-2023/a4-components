import React from "react";
import { Contact } from "./Contact";

export class ContactList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { contacts: [] };
        this.load();
    }

    async load() {
        await fetch("/docs", { method: 'GET'})
            .then((res) => res.json())
            .then((data) => {
                this.setState({ contacts: data });
            });
    }

    render() {
      return (
        <React.Fragment>
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
        </React.Fragment>
      )
}}
