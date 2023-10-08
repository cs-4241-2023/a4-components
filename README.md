# Assignment 4 - Components

<!-- Due: October 4th, by 11:59 AM.

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
--- -->

## TODO List Application From A2 In React

Glitch Link: http://a4-charlieroberts.glitch.me

<!-- Include a very brief summary of your project here and what you changed / added to assignment #3. Briefly (3–4 sentences) answer the following question: did the new technology improve or hinder the development experience? -->

This is a remake of the TODO List Application from A2 using React for the frontend and Express for the backend. In order to serve both the frontend and backend from the same server port, the vite-express module was utilized. I had some challenges setting this up in the beginning but was able to figure it out with some help from Akim, the class TA. For this assignment, I took my index.html file from A2 and split it up into smaller and more modularized components. I thought that React improved the development experience for me. It made me think more carefully about the design of my application, break it up into logical and more maintainable components. The large index.html file that I had from A2 was getting very complex and difficult to make changes to. In React, I split up my components into a logical structure that made more sense in terms of long-term maintainability. I split up the index.html into 3 broad components: Header, Main, and Footer components, which correspond to the header, main body, and footer sections of the webpage respectively. Inside of the Main component, I split the content up even further into a Form and ResultsTable component. And inside of the ResultsTable, I populated it with a list of TableRow components. I was having some difficulty at first wrapping my head around passing functions down through multiple child components, but it made more sense to me as I neared the completion of the remake. Also, achieving things such as rendering multiple rows, displaying JS varaibles in HTML, and updating all visual instances that uses the value of a certain variable is very straightforward and simple to accomplish in React in contrast to Vanilla JavaScript.

### Note: I have been granted an extension approved by Professor Roberts
