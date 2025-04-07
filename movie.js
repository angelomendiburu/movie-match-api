const express = require('express');
const router = express.Router();
const { getAllMovies, getMovieByTitle, getMovieById } = require('./movieUtils'); // Importar funciones necesarias
const fs = require('fs');
const csv = require('csv-parser');

// Define rutas para datos de películas
router.get('/', (req, res) => {
    getAllMovies((movies) => {
        res.json(movies); // Responder con un JSON de todas las películas
    });
});

router.get('/:id_or_name', (req, res) => {
    const param = req.params.id_or_name;

    // Intentar buscar por ID
    getMovieById(param, (movieById) => {
        if (movieById) {
            return res.json(movieById);
        }

        // Si no se encuentra por ID, intentar buscar por título
        getMovieByTitle(param, (movieByTitle) => {
            if (movieByTitle) {
                return res.json(movieByTitle);
            }

            // Si no se encuentra por ninguno, devolver error
            res.status(404).json({ error: 'Película no encontrada' });
        });
    });
});

router.get('/search/:title', (req, res) => {
    const title = decodeURIComponent(req.params.title.trim()); // Decodificar y eliminar espacios adicionales
    getMovieByTitle(title, (movie) => {
        if (movie) {
            res.send(`
                <html>
                <head>
                    <link rel="stylesheet" type="text/css" href="/styles.css">
                </head>
                <body>
                    <div class="container">
                        <h1>Detalles de la película: ${movie.title}</h1>
                        ${movie.image ? `<img src="${movie.image}" alt="${movie.title}" style="max-width: 300px; margin-bottom: 20px;">` : '<p>Imagen no disponible</p>'}
                        <p><strong>Año:</strong> ${movie.year}</p>
                        <p><strong>Género:</strong> ${movie.genre}</p>
                        <p><strong>Director:</strong> ${movie.director}</p>
                        <p><strong>Actores:</strong> ${movie.actors}</p>
                        <p><strong>Sinopsis:</strong> ${movie.plot}</p>
                        <p><strong>IMDB Rating:</strong> ${movie.imdb_rating}</p>
                        <p><strong>Duración:</strong> ${movie.runtime_minutes} minutos</p>
                        <a href="/">Volver</a>
                    </div>
                </body>
                </html>
            `);
        } else {
            res.status(404).send('<h1>Película no encontrada</h1>');
        }
    });
});

// Route to fetch movies by genre
router.get('/genre/:genre', (req, res) => {
    const genre = req.params.genre;
    const filePath = `./data/${genre}.csv`;

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: `No se encontró el archivo para el género: ${genre}` });
    }

    const movies = [];
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => movies.push(data))
        .on('end', () => {
            res.json(movies);
        })
        .on('error', (err) => {
            res.status(500).json({ error: 'Error al leer el archivo.' });
        });
});

module.exports = router;

// Verifica si el script se ejecuta directamente desde la línea de comandos
if (require.main === module) {
    const movieTitle = process.argv[2];
    if (movieTitle) {
        getMovieByTitle(movieTitle, (movie) => {
            if (movie) {
                console.log(movie);
            } else {
                console.log('Película no encontrada');
            }
        });
    } else {
        console.log('Por favor, proporciona un título de película');
    }
}
