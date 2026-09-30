function navigateTo(string) {
  window.location.replace(string);
}

function showPassword() {
  let x = document.getElementById("Password");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}
