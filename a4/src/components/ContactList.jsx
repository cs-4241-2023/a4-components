import { useLoaderData } from "react-router-dom";
import Contact from "./Contact";

export default function contactList() {
    const contacts = useLoaderData();

    return (
        <div className="contactList">
            {contacts.map((contact) => (
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
}

// Loader
export const contactsLoader = async function () {
    const response = await fetch("/contacts", {
        method: "GET",
    });
    const contacts = await response.json();
    console.log("LOADED: ", contacts);
    return contacts;
}
