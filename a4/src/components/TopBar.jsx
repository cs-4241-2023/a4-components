export default function TopBar(props) {
    
  const showForm = function () {
    // Hide the create contact button
    const button = document.getElementById("createButton");
    button.classList.add("hidden");
    // Show the form
    const form = document.getElementById("contactForm");
    form.classList.remove("hidden");
    // blur the contact list
    const list = document.getElementById("contactList");
    list.classList.add("blur-page");
  };

  return (
    <div id="contactHeader" className="top-bar">
      <h1>Contacts</h1>
      <div className="flex-row">
        <button
          id="createButton"
          className="createButton"
          onClick={(e) => showForm()}
        >
          Create Contact
        </button>
        <form action="/logout?_method=DELETE" method="POST">
          <button type="submit" className="logoutButton">
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}
