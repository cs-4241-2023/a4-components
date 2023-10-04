Sample Readme (delete the above when you're ready to submit, and modify the below so with your links and descriptions)
---

## Your Web Application Title

your hosting link e.g. http://a4-gribsyrup.glitch.me

Readme:

For A4, I chose to do the A4 Components assignment, which was re-implementing the client side of A2 using Svelte. I had some react experience from previous classes, such as Professor Heineman's CS3733 software engineering. However, even though react is very useful, it is a lot of work for a small project such as this one. I had heard that Svelte is built to use CSS, HTML, and Javascript technologies, so I decided to use Svelte.

Setting up Svelte was simple. I used the tutorial to code the client side, which made it a lot easier to complete the development (especially because the API is already available). I found it a litle bit odd to use scripting, CSS, and HTML components in the same file, but Svelte also has a global CSS file that controls all the UI components. Individual screens can be customized using local CSS components using <style> tags inside Svelte's source file.

The changes I made are:


1. Added App.svelte, which makes Post/Get calls to the server and render the results. 

2. Added global.css, which controls rendering.

3. Added Button.svelte for rendering buttons.

4. Retained server.js to run node.js's server side. It will be running on port 3002.

5. The client will be running on port 3000.

6. Local access to the app is http://localhost:3000.