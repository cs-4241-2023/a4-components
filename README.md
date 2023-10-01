## Assignment 3 : Homework Helper

Colin Mettler : a3colinm1215-m9bh3.ondigitalocean.app

The goal of this application is to create a small website that users can use to help organize and plan out their homework. They input the task, the amount of hours they estimate the task has remaining, and the date the task is due. The website then logs the task for that user, automatically counting the amount of days left to the due date, as well as the priority of the task as a function of the estimated time cost and the remaining time to do it in. Among the challenges I had for this application was getting it to work on Digital Ocean with the mongodb database, as well as making sure only the tasks entered by a certain user could be seen by that user. I used github OAuth through the passport.js module for login. The Water.css framework was used. The five express middleware packages I used are 

1. body-parser: Parses incoming request bodies, making it easier to extract parameters.
2. express-session: Manages user sessions to keep track of user data across requests.
3. passport: Provides authentication middleware for Express, supporting various strategies.
4. mongoose: Facilitates MongoDB object modeling for Node.js, simplifying database operations.
5. Custom Middleware: I made a custom function that detects if the user has been authenticated using the passport.js github OAuth, and if not redirects them to the login page.

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via passport.js's github OAuth system
- **Tech Achievement 2**: I obtained 100% in all four lighthouse tests required for this assignment. 
- **Tech Achievement 3**: I hosted the website on DigitalOcean
