const express = require('express'),
    cors = require('cors'),
    routers = require('./server/routes/routes.js'),
    path = require('path');
require('./server/db/mongoose');

const port = process.env.PORT;
const app = express();

app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pages
app.use('/list', express.static(path.join(__dirname, 'public/index.html')));
app.use('/add', express.static(path.join(__dirname, 'public/add_movie_form.html')));
app.use('/edit', express.static(path.join(__dirname, 'public/edit_movie_form.html')));

// Folders
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

app.use('/', routers);
app.use('/', (req, res) => {
    res.redirect('/list');
});

const server = app.listen(port, () => {
    console.log('listening on port %s...', server.address().port);
});