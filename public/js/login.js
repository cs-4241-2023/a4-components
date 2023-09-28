// FRONT-END (CLIENT) JAVASCRIPT HERE

const login = async function( event ) {

  event.preventDefault()
  
  const username = document.getElementById('username')
  const password = document.getElementById('password')
  body = username.value + " " + password.value;

  const response = await fetch( '/login', {
    method:'POST',
    body 
  })

  const validity = await response.text()

  const errorMsg = document.getElementById("loginError");

  if(validity === "true"){

    errorMsg.textContent = ""
    body = username.value;
    const response = await fetch('/assignActiveUser', {
      method: 'POST',
      body
    })

    window.location.href = '/index';
    
    console.log(response.value)
  } else {

    errorMsg.textContent = "Invalid Login info"
  }

}

const signup = async function( event ) {
  event.preventDefault()
  
  const username = document.getElementById('username')
  const password = document.getElementById('password')

  
  body = username.value + " " + password.value;

  const response = await fetch( '/signup', {
    method:'POST',
    body 
  })

  const validity = await response.text()

  const errorMsg = document.getElementById("loginError");

  if(validity === "true"){
    errorMsg.textContent = "Added Account to System"

  } else {
    
  }

   
    

}


window.addEventListener('load', async function () {

  const button = document.getElementById("loginButton");
  button.onclick = login;

  const button2 = document.getElementById("signupButton");
  button2.onclick = signup;

  document.getElementById('github-login-button').addEventListener('click', async () => {
    // Redirect the user to your server's OAuth authentication route
    window.location.href = '/auth/github';
  });
})


