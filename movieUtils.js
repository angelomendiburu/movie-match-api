const fs = require('fs');
const csv = require('csv-parser');

// Función para obtener detalles de la película por título
function getMovieByTitle(title, callback) {
    const results = [];
    fs.createReadStream('./data/movies.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            const movie = results.find(movie => movie.title.toLowerCase() === title.toLowerCase());
            if (movie) {
                callback(movie);
            } else {
                callback(null);
            }
        });
}

// Función para obtener una película al azar
function getRandomMovie(callback) {
    const results = [];
    fs.createReadStream('./data/movies.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            const randomIndex = Math.floor(Math.random() * results.length);
            const movie = results[randomIndex];
            callback({
                title: movie.title,
                year: movie.year,
                genre: movie.genre,
                director: movie.director,
                plot: movie.plot
            });
        });
}

// Función para obtener sugerencias de películas por título
function getMovieSuggestions(query, callback) {
    const results = [];
    fs.createReadStream('./data/movies.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            const suggestions = results.filter(movie => movie.title.toLowerCase().includes(query.toLowerCase()));
            callback(suggestions);
        });
}

// Función para obtener todas las películas
function getAllMovies(callback) {
    const results = [];
    fs.createReadStream('./data/movies.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            callback(results);
        });
}

// Función para obtener detalles de la película por ID
function getMovieById(id, callback) {
    const results = [];
    fs.createReadStream('./data/movies.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            const movie = results.find(movie => movie.id === id);
            if (movie) {
                callback(movie);
            } else {
                callback(null);
            }
        });
}

module.exports = { getMovieByTitle, getRandomMovie, getMovieSuggestions, getAllMovies, getMovieById };
