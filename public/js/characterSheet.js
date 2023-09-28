const addCharacter = async function (event) {

    event.preventDefault()

    const nameInput = document.querySelector('#characterName');
    const startInput = document.querySelector('#characterStart');
    const endInput = document.querySelector('#characterEnd');

    const errorMsg = document.getElementById("characterErrorMessage")


    //name duplicate check preprocessing
    const characterTable = document.getElementById("characterTable");
    const nameArray = [];

    const rows = characterTable.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        const cell = rows[i].getElementsByTagName("td")[0];
        nameArray.push(cell.textContent.trim());
    }
    if (nameArray.includes(nameInput.value)) {
        errorMsg.textContent = "Name must be unique"
        errorMsg.style.display = "block";
    } else if (isNaN(startInput.value) || isNaN(endInput.value)) {
        errorMsg.textContent = "Enter a numerical value for birth and death"
        errorMsg.style.display = "block";
    } else {

        document.getElementById("characterErrorMessage").style.display = "none";

        const json = { name: nameInput.value, start: parseInt(startInput.value), end: parseInt(endInput.value), era: "" }, body = JSON.stringify(json)

        const response = await fetch('/characterData', {
            method: 'POST',
            body
        })

        const data = await response.json()

        console.log('text:', data)
        CreateCharacterTable(data);
    }

}

function CreateCharacterTable(data) {

    const characterTable = document.getElementById("characterTable");
    characterTable.innerHTML = "";
    characterTable.append(CreateHeaderRow());
    for (let i = 0; i < data.length; i++) {
        characterTable.append(CreateRow(data[i], i));
    }
}

function CreateHeaderRow() {
    let row = document.createElement("tr");
    row.append(CreateHeaderCell("Name"));
    row.append(CreateHeaderCell("Birth"));
    row.append(CreateHeaderCell("Death"));
    row.append(CreateHeaderCell("Eras"));
    row.append(CreateHeaderCell("Delete/Modify"));
    return row;
}

function CreateHeaderCell(cellInfo) {
    const cell = document.createElement('th');
    cell.innerHTML = `<p>${cellInfo}</p>`;
    return cell;
}

function CreateCell(cellInfo) {
    const cell = document.createElement('td');
    cell.innerHTML = `<p>${cellInfo}</p>`;
    return cell;
}

function CreateRow(value, id) {
    let row = document.createElement("tr");
    row.append(CreateCell(value.name));
    row.append(CreateCell(value.start));
    row.append(CreateCell(value.end));
    row.append(CreateCell(value.era));
    row.append(CreateDeleteAndModifyButton(value,id));
    return row;
}

async function DeleteRow(name) {
    console.log("Delete Row")
    const response = await fetch("/characterData", {
        method: "DELETE",
        body: name
    })

    const output = await response.json()
    

    CreateCharacterTable(output);
}

async function ModifyRow(identifier, id) {

    const nameInput = document.querySelector('#characterName');
    const startInput = document.querySelector('#characterStart');
    const endInput = document.querySelector('#characterEnd');

    const errorMsg = document.getElementById("characterErrorMessage")


    //name duplicate check preprocessing
    const characterTable = document.getElementById("characterTable");
    const nameArray = [];

    const rows = characterTable.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        const cell = rows[i].getElementsByTagName("td")[0];
        nameArray.push(cell.textContent.trim());
    }

    const location = nameArray.indexOf(nameInput.value);
    if (nameArray.includes(nameInput.value) && location != id) {
        errorMsg.textContent = "Name must be unique"
        errorMsg.style.display = "block";
    } else if (isNaN(startInput.value) || isNaN(endInput.value)) {
        errorMsg.textContent = "Enter a numerical value for birth and death"
        errorMsg.style.display = "block";
    } else {
        document.getElementById("characterErrorMessage").style.display = "none";

      

        const json = { _id: identifier, name: nameInput.value, start: parseInt(startInput.value), end: parseInt(endInput.value), era: "" }, body = JSON.stringify(json)

        

        const response = await fetch('/modifyCharacterData', {
            method: 'POST',
            body: body
        })

        const data = await response.json()

        console.log('text:', data)
        CreateCharacterTable(data);
    }




}
function CreateDeleteAndModifyButton(jsonString, id) {
    const cell = document.createElement('td');
    cell.className = "delete";

    const deleteButton = document.createElement('button');
    deleteButton.className = "delete-button" + id;
    deleteButton.innerHTML = '<p>X</p>';
    deleteButton.onclick = () => {
        DeleteRow(jsonString.name);
    }

    const modifyButton = document.createElement('button');
    modifyButton.className = "modify-button" + id;
    modifyButton.innerHTML = '<p>Modify</p>';
    modifyButton.onclick = () => {
        ModifyRow(jsonString._id, id);
    }

    cell.append(deleteButton);
    cell.append(modifyButton);
    return cell;
}

window.addEventListener('load', async function () {

    const button = document.getElementById("addCharacterButton");
    button.onclick = addCharacter;

    const response = await fetch('/characterData', {
        method: 'GET'
    })

    const data = await response.json();
    CreateCharacterTable(data);




})

window.addEventListener('updateCharacters', async function handleUpdateCharacters() {
    const response = await fetch('/characterData', {
        method: 'GET'
    })

    const data = await response.json();
    CreateCharacterTable(data);
    //window.location.reload();
});
