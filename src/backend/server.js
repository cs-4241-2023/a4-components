import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import express, { json, static as expressStatic } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';


// Then use the properties you need as follows:
import session from 'express-session';
const app = express();
const port = 3001;
import dotenv from 'dotenv';
dotenv.config();

app.use(express.static('dist'));

// Connect to MongoDB
connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(cors());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

app.use(session());

app.use(json()); // Parse JSON request bodies
app.use(expressStatic('src/public'));

import blogPostRoutes from './routes/blogRoutes.js';

app.get('/', (req, res) => {
    res.redirect('/blogs');
})

app.get('/blogs', (req, res) => {
    res.sendFile(__dirname + '/src/public/blog.html');
});

app.use('/api/blogs', blogPostRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
