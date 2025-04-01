const express = require('express');
const app = express();
const movieRouter = require('./movie'); // Importar el enrutador de películas
const { getMovieSuggestions } = require('./movieUtils'); // Importar la función de sugerencias
const { showSuggestionsScript } = require('./utils/frontendUtils'); // Importar función modularizada

const PORT = process.env.PORT || 3000;

app.use(express.static('public')); // Servir archivos estáticos desde la carpeta 'public'

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
                <form action="/search" method="get">
                    <input type="text" id="search-input" name="title" placeholder="Buscar película por título" onkeyup="showSuggestions(this.value)">
                    <button type="submit">Buscar</button>
                </form>
                <ul id="suggestions"></ul>
                <ul>
                    <li><a href="/movies">Lista de películas</a></li>
                    <li><a href="/movies/1">Detalles de una película por ID</a></li>
                </ul>
            </div>
            <script>
                ${showSuggestionsScript}
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

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
