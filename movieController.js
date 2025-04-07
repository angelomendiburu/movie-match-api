const movieService = require('../services/movieService');

function getAllMovies(req, res) {
    const { genre } = req.query;

    movieService.getAllMoviesService((movies) => {
        if (genre) {
            const filteredMovies = movies.filter(movie => {
                // Asegurarse de que movie.genre sea una cadena válida
                if (typeof movie.genre === 'string') {
                    const normalizedGenres = movie.genre
                        .toLowerCase()
                        .replace(/"/g, '') // Eliminar comillas
                        .split(',') // Dividir por comas
                        .map(g => g.trim()); // Quitar espacios extra
                    return normalizedGenres.includes(genre.toLowerCase().trim());
                }
                return false;
            });

            // Verificar si se encontraron películas del género solicitado
            if (filteredMovies.length === 0) {
                return res.status(404).json({ error: `No se encontraron películas del género: ${genre}` });
            }

            // Retornar solo las películas filtradas
            return res.status(200).json(filteredMovies);
        }

        // Retornar todas las películas si no se especifica un género
        res.status(200).json(movies);
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
    const title = decodeURIComponent(req.params.title.trim());
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

function searchMoviesByCriteria(req, res) {
    const { name, year } = req.query;

    movieService.searchMoviesService(name, year, (movies) => {
        if (movies.length > 0) {
            const movie = movies[0]; // Seleccionar la película más acertada
            res.send(`
                <html>
                <head>
                    <link rel="stylesheet" type="text/css" href="/styles.css">
                </head>
                <body>
                    <div class="container">
                        <h1>Detalles de la película más acertada</h1>
                        <p><strong>Título:</strong> ${movie.title}</p>
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
            res.status(404).send('<h1>No se encontraron películas</h1>');
        }
    });
}

module.exports = {  
    getAllMovies, 
    getMovieByIdOrTitle, 
    searchMovieByTitle, 
    searchMovies, 
    searchMoviesByCriteria 
};