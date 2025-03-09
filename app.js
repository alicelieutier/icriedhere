const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const app = express();

// Set Handlebars as the view engine
app.engine('handlebars', engine({
    partialsDir: path.join(__dirname, 'views', 'partials')
}));
app.set('view engine', 'handlebars');
// app.set('views', './views');

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', {
        title:'I Cried Here',
        description:"I cried here is a design project about normalising emotions everywhere, using stickers that say: I cried here.",
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title:'About - I Cried Here',
        description: "I cried here is a design project about normalising emotions, created by designer Alice Lieutier.",
    });
});

app.get('/stickers', (req, res) => {
    res.render('stickers', {
        title:'Stickers - I Cried Here',
        description: "I cried here is a design project about normalising emotions everywhere. Get your 'I cried here' stickers here.",
    });
});

const port = 3000;

app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);  
});
