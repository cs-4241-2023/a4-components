const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { createServer: createViteServer } = require('vite');
const { storageService } = require('./services/storage.service');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

const server_port = process.env.SERVER_PORT;
const express_session_token = process.env.EXPRESS_SESSION_TOKEN;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: express_session_token, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  async (username, password, done) => {
    const user = await storageService.findUserByUsername(username);
    if (!user) {
      return done(null, false, { message: 'User not found' });
    }
    const isValidPassword = bcrypt.compareSync(password, user.hashedPassword);
    if (!isValidPassword) {
      return done(null, false, { message: 'Invalid password' });
    }
    return done(null, user);
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await storageService.findUserById(id);
  done(null, user);
});

app.post('/login', passport.authenticate('local'), (req, res) => {
  res.json(req.user);
});

app.post('/register', async (req, res) => {
  const { username, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).send('Passwords do not match');
  }
  const existingUser = await storageService.findUserByUsername(username);
  if (existingUser) {
    return res.status(400).send('Username already taken');
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = await storageService.createUser(username, hashedPassword);
  req.login(user, err => {
    if (err) { return res.status(500).send(err.message); }
    return res.json(user);
  });
});

async function createViteServerMiddleware() {
  const vite = await createViteServer({
    server: { middlewareMode: 'true' },
    configFile: path.resolve(__dirname, '../vite.config.ts'),  // Path to your Vite config file
  });

  // Use Vite's connect instance as middleware
  app.use(vite.middlewares);

  app.use('*', async (req, res) => {
    try {
      // Serve index.html - Vite transforms it on-the-fly!
      const { render } = await vite.ssrLoadModule('/src/index.tsx');  // Adjust path if necessary
      const html = await render({ url: req.originalUrl });
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      console.error(e.stack);
      res.status(500).end(e.stack);
    }
  });

  app.listen(server_port, () => {
    console.log('Server is running on http://localhost:${server_port}');
  });
}

createViteServerMiddleware();
