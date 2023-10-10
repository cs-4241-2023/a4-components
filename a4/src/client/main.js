import "./style.css";

const submit = function (event) {
  event.preventDefault();

  let input = document.querySelectorAll("#Email, #Name, #Birth")
   let json = {
      Email: input[0].value,
      Name: input[1].value,
      Birth: input[2].value,
      Age: age(input[2].value)
    };

  let response = fetch("/submit", {
    method: "POST",
    headers:{'Content-Type': 'application/json'},
    body: JSON.stringify(json),
  }).then(res=> res.json())
  .then(function(res){
    document.querySelector("#fade").style.display = "block";
    setTimeout(function () {
    document.querySelector("#fade").style.display = "none";
  }, 1500);
  })
  display(event)
  
};

const age= function(birth) {
let date = new Date(birth);
let diff = Date.now() - date.getTime();
let date1 = new Date(diff);
let age = Math.abs(date1.getUTCFullYear() - 1970);
return age;
}

const display = function (event) {
  event.preventDefault();

  clear(event);

  let res = fetch("/display", {
    method: "GET",
  }).then(res => res.json())
    .then(function (res) {
      const list = document.getElementById("data");
      const header = document.createElement("tr");
      header.innerHTML = `<th>Email</th> <th>Name</th> <th>Birth</th> <th>Age</th> <th>Delete/Edit</th>`;
      list.appendChild(header);
      let i = 0;
      res.forEach((d) => {
        const item = document.createElement("tr");
        item.innerHTML = `
       <td contenteditable='false'>${d.Email}</td> 
       <td contenteditable='false'>${d.Name}</td>
       <td contenteditable='false'>${d.Birth}</td>
       <td contenteditable='false'>${d.Age} years old</td>
       <td contenteditable='false'>row:${i} <input type="checkbox" class="checkOnce" id="C${i}"onclick='checkedOnClick(this)' value='${d._id}'/></td>
       `;
        i++;
        list.appendChild(item);
      });

      document.body.appendChild(list);
    });
};
//clear
const clear = function (event) {
  event.preventDefault();
  let table = document.getElementById("data");
  table.innerHTML = "";
};


window.onload= function(){
  const button1 = document.querySelector("#submit");
  const button2 = document.querySelector("#display");
  const button4 = document.querySelector("#clear");
  button1.onclick = submit;
  button2.onclick = display;
  button4.onclick = clear;
}

