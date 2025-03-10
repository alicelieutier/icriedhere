require('dotenv').config();
const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const moment = require('moment');
const app = express();

// Set Handlebars as the view engine
app.engine('handlebars', engine({
    partialsDir: path.join(__dirname, 'views', 'partials')
}));

app.set('view engine', 'handlebars');

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const defaultDescription = "I cried here is a design project about normalising emotions everywhere";

app.get('/', (req, res) => {
    res.render('index', {
        title:'I Cried Here',
        description:`${defaultDescription}, using stickers that say: I cried here.`,
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title:'About - I Cried Here',
        description: `${defaultDescription}, created by designer Alice Lieutier.`,
    });
});

app.get('/stickers', (req, res) => {
    res.render('stickers', {
        title:'Stickers - I Cried Here',
        description: `${defaultDescription}. Get your 'I cried here' stickers here.`,
    });
});


const formatStoryDetails = (story) => {
    const name = story.name || 'Anonymous';
    const age = story.age ? `, ${story.age}` : '';
    const created_at = moment(story.created_at).fromNow();
    return `${name} ${age} - ${created_at}`;
};

app.get('/stories', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM stories WHERE visible = true');
        const stories = result.rows.map(story => {
            return {
                story: story.story,
                details: formatStoryDetails(story)
            };
        });
        res.render('stories', {
            title: 'Stories - I Cried Here',
            description: `${defaultDescription}. Share your story of crying on this page.`,
            stories: stories
        });
    } catch (err) {
        console.error(err);
        res.render('stories', {
            title: 'Stories - I Cried Here',
            description: `${defaultDescription}. Share your story of crying on this page.`,
            stories: [],
            error: 'Error retrieving stories'
        });
    }
});

app.post('/stories', async (req, res) => {
    const { story, name, age, email } = req.body;
    try {
        await pool.query(
            'INSERT INTO stories (story, visible, name, age, email, created_at) VALUES ($1, $2, $3, $4, $5, $6)',
            [story, false, name || null, age || null, email || null, new Date()]
        );
        res.redirect('/stories');
    } catch (err) {
        console.error(err);
        res.send('Error submitting story');
    }
});

const port = 3000;

app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);  
});
