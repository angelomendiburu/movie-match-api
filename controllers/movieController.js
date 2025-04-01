const movieService = require('../services/movieService');

function getAllMovies(req, res) {
    movieService.getAllMoviesService((movies) => {
        res.json(movies);
    });
}

function getMovieByIdOrTitle(req, res) {
    const param = req.params.id_or_name;

    movieService.getMovieByIdService(param, (movieById) => {
        if (movieById) {
            return res.json(movieById);
        }

        movieService.getMovieByTitleService(param, (movieByTitle) => {
            if (movieByTitle) {
                return res.json(movieByTitle);
            }

            res.status(404).json({ error: 'Película no encontrada' });
        });
    });
}

function searchMovieByTitle(req, res) {
    const title = req.params.title;
    movieService.getMovieByTitleService(title, (movie) => {
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
            res.status(404).send('<h1>Película no encontrada</h1>');
        }
    });
}

function searchMovies(req, res) {
    const { name, year } = req.query;

    movieService.searchMoviesService(name, year, (movies) => {
        if (movies.length > 0) {
            res.json(movies);
        } else {
            res.status(404).json({ error: 'No se encontraron películas con los criterios proporcionados' });
        }
    });
}

module.exports = { getAllMovies, getMovieByIdOrTitle, searchMovieByTitle, searchMovies };
