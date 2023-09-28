// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const input = document.querySelector( '#yourname' ),
        json = { yourname: input.value },
        body = JSON.stringify( json )

  const response = await fetch( '/submit', {
    method:'POST',
    body 
  })

  const text = await response.text()

  console.log( 'text:', text )
}

function openTab(evt, tabName){

  let i, tabContent, tabLinks;

  //hide all content
  tabContent = document.getElementsByClassName("tabContent");
  for(i=0; i <tabContent.length; i++){
    tabContent[i].style.display = "none";
  }

  //remove class active
  tabLinks = document.getElementsByClassName("tabLinks");
  for(i=0; i <tabLinks.length; i++){
    tabLinks[i].className = tabLinks[i].className.replace("active", "");
  }

  //show current tab
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += "active";


}
