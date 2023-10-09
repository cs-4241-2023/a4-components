import { useState, useEffect } from "react";
import { TopBar } from "./components/TopBar";
import { Contact } from "./components/Contact";

const App = () => {
  const [contacts, setContacts] = useState([ ]);

  async function editContact(json) {
    fetch("/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: json,
    }).then((res) => res.json()).then((data) => {
      setContacts( data );
    });
  };

  async function add() {
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
    fetch("/add", {
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
    }).then((res) => res.json()).then((json) => {
        setContacts( json );
    });
  }

  
  async function remove(id) {
    // hide the component
    const response = await fetch("/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    }).then((response) => response.json()).then((json) => {
      setContacts( json );
    });
  }

  useEffect(() => {
    fetch('/docs')
      .then(response => response.json())
      .then(json => {
        setContacts(json)
      })
  }, [])

  return (
    <>
      <div id="parent-div">
        <TopBar onCreate={ add }/>
        <ul>
          {contacts.map((contact, i) => (
            <Contact
              id = {contact.id}
              firstName={contact.firstName}
              lastName={contact.lastName}
              phone={contact.phone}
              email={contact.email}
              dateOfBirth={contact.dateOfBirth}
              streetAddress={ contact.streetAddress }
              city= { contact.city }
              state= { contact.state }
              zipCode= { contact.zipCode }
              lastEdited={contact.lastEdited + " day(s) ago"}
              onRemove={ remove }
              onSubmitEdit = { editContact }
            />
          ))}
        </ul>
      </div>
    </>
  );
}
export default App;
