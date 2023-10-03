import React from 'react'
import ReactDOM from 'react-dom/client'
import Timeline from './Timeline.jsx'
import Character from './Characters.jsx'
import '../css/index.css'
import '../css/timeline.css'
import '../css/characterSheet.css'

ReactDOM.createRoot( document.getElementById( 'root' ) ).render(

  
  <React.StrictMode>
    
  <div className="tab">
    <button className="tabLinks" onClick={e => openTab(e, "InformationDoc")} id="defaultOpen">About This Site</button>
    <button className="tabLinks" onClick={e => openTab(e, "CharacterSheet")}>Characters</button>
  </div>

  <div id="InformationDoc" className="tabContent">
    <h3>Character Creator</h3>
    <p>
      One difficulty many world creators have is keeping track of their timelines and histories. This website is an attempt to remedy this problem.
      First, create a timeline for your fictional world by adding, deleting, or modifying eras in your world. Then, create a character with a birth 
      and death date in the character creation screen, and the website will do the rest. To modify, enter in your desired changes to a specific character 
      and click "modify". Any changes in the characters or the timeline will be immediately reflected in the website. <br/>
      Happy creating!
    </p>
   
  </div>

  <div id="CharacterSheet" className="tabContent">
    <h3>Character Table</h3>
    <Character />
   
  </div>

  <div className='timelineContainer'>
    <Timeline />
  </div>


    
  </React.StrictMode>,
)


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