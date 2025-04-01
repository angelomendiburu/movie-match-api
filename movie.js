const express = require('express');
const router = express.Router();
const { getAllMovies, getMovieByTitle, getMovieById } = require('./movieUtils'); // Importar funciones necesarias

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
    const title = req.params.title;
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
                        <p><strong>Año:</strong> ${movie.year}</p>
                        <p><strong>Género:</strong> ${movie.genre}</p>
                        <p><strong>Director:</strong> ${movie.director}</p>
                        <p><strong>Actores:</strong> ${movie.actors}</p>
                        <p><strong>Sinopsis:</strong> ${movie.plot}</p>
                        <p><strong>IMDB Rating:</strong> ${movie.imdb_rating}</p>
                        <p><strong>Duración:</strong> ${movie.runtime_minutes} minutos</p>
                    </div>
                </body>
                </html>
            `);
        } else {
            res.send(`
                <html>
                <head>
                    <link rel="stylesheet" type="text/css" href="/styles.css">
                </head>
                <body>
                    <div class="container">
                        <h1>Película no encontrada</h1>
                    </div>
                </body>
                </html>
            `);
        }
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
