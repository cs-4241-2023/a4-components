// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const form = document.querySelector('form')


  const inputEmail = form["email"],
        inputPass = form['pass']
      
  const json = { 'email': inputEmail.value, 'pass': inputPass.value }, 
        body = JSON.stringify( json )
  
  const response = await fetch( '/login', {
    method:'POST',
    body
  })


  const text = await response.text()
  if (response == null){

  }
  window.location.replace('/index.html')
  form.reset()
}

window.onload = function() {
  const loginButton = document.getElementById("loginButton");
  loginButton.onclick = submit;
}