Assignment 4 - Components
===

     <ul id="cartList">
     { cartList.map( (grocery,i) => <CartItem key={i} num={i}name={grocery.itemName} price={grocery.price.toFixed(2)} onclick={ modify } /> ) }
     </ul>

Due: October 4th, by 11:59 AM.

For this assignment you will re-implement the client side portion of *either* A2 or A3 using either React or Svelte components. If you choose A3 you only need to use components for the data display / updating; you can leave your login UI as is.

[Svelte Tutorial](https://github.com/cs-4241-23/cs-4241-23.github.io/blob/main/using.svelte.md)
[React Tutorial](https://github.com/cs-4241-23/cs-4241-23.github.io/blob/main/using.react.md)

This project can be implemented on any hosting service (Glitch, DigitalOcean, Heroku etc.), however, you must include all files in your GitHub repo so that the course staff can view them.

Deliverables
---

Do the following to complete this assignment:

1. Implement your project with the above requirements.
3. Test your project to make sure that when someone goes to your main page on Glitch/Heroku/etc., it displays correctly.
4. Ensure that your project has the proper naming scheme `a4-firstname-lastname` so we can find it.
5. Fork this repository and modify the README to the specifications below. Be sure to add *all* project files.
6. Create and submit a Pull Request to the original repo. Name the pull request using the following template: `a4-firstname-lastname`.

Sample Readme (delete the above when you're ready to submit, and modify the below so with your links and descriptions)
---

## Your Web Application Title

your hosting link e.g. http://a4-charlieroberts.glitch.me

Include a very brief summary of your project here and what you changed / added to assignment #3. Briefly (3–4 sentences) answer the following question: did the new technology improve or hinder the development experience?

Unlike previous assignments, this assignment will be solely graded on whether or not you successfully complete it. Partial credit will be generously given.
