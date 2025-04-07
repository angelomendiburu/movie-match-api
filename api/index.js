const express = require('express');
const movieRouter = require('../movie'); // Importar el enrutador de películas
const { getMovieSuggestions } = require('../movieUtils'); // Importar la función de sugerencias
const { showSuggestionsScript } = require('../utils/frontendUtils'); // Importar función modularizada
const logger = require('../middlewares/logger');
const cors = require('../middlewares/cors');
const errorHandler = require('../middlewares/errorHandler');

const app = express();

app.use(express.static('public')); // Servir archivos estáticos desde la carpeta 'public'
app.use(logger); // Middleware de logging
app.use(cors); // Middleware de CORS

app.use('/movies', movieRouter); // Usar el enrutador de películas

app.get('/', (req, res) => {
    res.send(`
        <html>
        <head>
            <link rel="stylesheet" type="text/css" href="/styles.css">
        </head>
        <body>
            <div class="container">
                <h1>¡Movie Match API está corriendo!</h1>
                <form id="searchForm" style="margin-bottom: 20px;">
                    <input type="text" id="searchInput" name="name" placeholder="Buscar por título parcial o año" onkeyup="showSuggestions(this.value)" style="margin-right: 10px;">
                    <button type="button" onclick="redirectSearch()">Filtrar</button>
                </form>
                <ul id="suggestions"></ul>
                <div style="margin-bottom: 20px;">
                    <h2>Filtrar por género</h2>
                    <button onclick="filterByGenre('Drama')">Drama</button>
                    <button onclick="filterByGenre('Action')">Action</button>
                    <button onclick="filterByGenre('Comedy')">Comedy</button>
                    <button onclick="filterByGenre('Sci-Fi')">Sci-Fi</button>
                    <button onclick="filterByGenre('Crime')">Crime</button>
                    <button onclick="filterByGenre('Adventure')">Adventure</button>
                    <button onclick="filterByGenre('Animation')">Animation</button>
                    <button onclick="filterByGenre('War')">War</button>
                    <button onclick="filterByGenre('Romance')">Romance</button>
                    <button onclick="filterByGenre('Horror')">Horror</button>
                    <button onclick="filterByGenre('Western')">Western</button>
                    <button onclick="filterByGenre('Biography')">Biography</button>
                    <button onclick="filterByGenre('Fantasy')">Fantasy</button>
                    <button onclick="filterByGenre('Mystery')">Mystery</button>
                    <button onclick="filterByGenre('Thriller')">Thriller</button>
                </div>
                <ul>
                    <li><a href="/movies">Lista de películas</a></li>
                    <li><a href="/movies/1">Detalles de una película por ID</a></li>
                </ul>
            </div>
            <script>
                ${showSuggestionsScript}
                function redirectSearch() {
                    const input = document.getElementById('searchInput').value.trim();
                    if (input) {
                        window.location.href = '/movies/search/' + encodeURIComponent(input);
                    } else {
                        alert('Por favor, ingresa un título para buscar.');
                    }
                }
                function filterByGenre(genre) {
                    window.location.href = '/movies/genre/' + encodeURIComponent(genre);
                }
            </script>
        </body>
        </html>
    `);
});

app.get('/search', (req, res) => {
    const title = req.query.title;
    res.redirect(`/movies/search/${title}`);
});

app.get('/autocomplete', (req, res) => {
    const query = req.query.query;
    getMovieSuggestions(query, (suggestions) => {
        res.json(suggestions);
    });
});

app.use((req, res, next) => {
    const error = new Error("Recurso no encontrado");
    error.status = 404;
    next(error);
});

app.use(errorHandler); // Middleware de manejo de errores

app.use((err, req, res, next) => {
    console.error(err.stack); // Log del error
    res.status(500).json({ error: "Error interno del servidor" });
});

module.exports = app;
