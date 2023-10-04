const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { storageService } = require('./services/storage.service');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

const server_port = process.env.PORT || 3000;
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

app.post('/tasks', async (req, res) => {
    if (req.isAuthenticated()) {
        console.log("Creating a task")
        const { title, details, subTasks } = req.body;
        const newTaskData = {
            userId: req.user._id,
            title: title || '',
            details: details || '',
            subTasks: subTasks || []
        }
        try {
            const newTask = await storageService.createTask(newTaskData);
            res.status(201).json(newTask);
        } catch (error) {
            res.status(500).send("Failed to create new task");
            console.error("Error:", error);
        }
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
});

app.get('/user-info', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ userId: req.user._id, username: req.user.username });
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
});

app.get('/user-tasks', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const tasks = await storageService.getTasks(req.user._id);
            res.json(tasks);
        } catch (error) {
            console.error("Failed to fetch user tasks:", error);
            res.status(500).send("Error fetching tasks");
        }
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
});

app.put('/task/:taskId', async (req, res) => {
    console.log("Updating task")
    try {
        const taskId = req.params.taskId;
        console.log("Updating task", taskId, "with content", req.body)
        const updatedTask = await storageService.updateTask(taskId, req.body);
        res.json(updatedTask);
    } catch (error) {
        res.status(500).send('Failed to update task');
    }
});

app.delete('/task/:taskId', async (req, res) => {
    console.log("Deleting a task")
    const { taskId } = req.params;

    try {
        const deletedCount = await storageService.deleteTask(taskId);
        if (deletedCount && deletedCount > 0) {
            res.status(200).send({ message: 'Task deleted successfully' });
        } else {
            res.status(404).send({ message: 'Task not found' });
        }
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Serve static files from the dist directory
app.use(express.static(path.resolve(__dirname, '../dist')));

// Handle SPA routing by serving index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
});

app.listen(server_port, () => {
    console.log(`Server is running on http://localhost:${server_port}`);
});

process.on('SIGINT', async () => {
    await storageService.client.close();
    process.exit();
});
