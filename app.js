require('dotenv').config();
const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const moment = require('moment');
const app = express();
const port = 3000;

app.engine('handlebars', engine({
    partialsDir: path.join(__dirname, 'views', 'partials')
}));

app.set('view engine', 'handlebars');

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const query = (text, params) => {
    console.log('Executing query:', text, params);
    return pool.query(text, params)
}

// Log HTTP requests and responses
app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${res.statusCode} response for ${req.url} in ${duration}ms`);
    });
    next();
});

// 301 redirects because Google indexed my old .html pages
app.use((req, res, next) => {
    if (req.path === '/stickers.html') {
        res.redirect(301, '/stickers');
    } else if (req.path === '/about.html') {
        res.redirect(301, '/about');
    } else {
        next();
    }
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

app.get('/stories', async (req, res) => {
    res.render('stories', {
        title: 'Stories - I Cried Here',
        description: `${defaultDescription}. Share your story of crying on this page.`,
        stylesheets: ['loader.css'],
        scripts: ['stories.js'],
    });
});

const formatStoryDetails = (story) => {
    const name = story.name || 'Anonymous';
    const age = story.age ? `, ${story.age}` : '';
    const created_at = moment(story.created_at).fromNow();
    return `${name}${age} - ${created_at}`;
};

app.get('/api/stories', async (req, res) => {
    try {
        const result = await query('SELECT * FROM stories WHERE visible = true');
        const stories = result.rows.map(story => ({
            story: story.story,
            details: formatStoryDetails(story)
        }));
        res.json(stories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error retrieving stories' });
    }
});

app.post('/api/stories', async (req, res) => {
    const { story, name, age, email } = req.body;
    try {
        await query(
            'INSERT INTO stories (story, visible, name, age, email, created_at) VALUES ($1, $2, $3, $4, $5, $6)',
            [story, false, name || null, age || null, email || null, new Date()]
        );
        res.status(201).json({ message: 'Story submitted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error submitting story' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);  
});
