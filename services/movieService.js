const fs = require('fs');
const csv = require('csv-parser');

function getAllMoviesService(callback) {
    const results = [];
    fs.createReadStream('./data/movies.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            callback(results);
        });
}

function getMovieByIdService(id, callback) {
    const results = [];
    fs.createReadStream('./data/movies.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            const movie = results.find(movie => movie.id === id);
            callback(movie || null);
        });
}

function getMovieByTitleService(title, callback) {
    const results = [];
    fs.createReadStream('./data/movies.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            const movie = results.find(movie => movie.title.toLowerCase() === title.toLowerCase());
            callback(movie || null);
        });
}

function searchMoviesService(name, year, callback) {
    const results = [];
    fs.createReadStream('./data/movies.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            let filteredMovies = results;

            if (name) {
                filteredMovies = filteredMovies.filter(movie =>
                    movie.title.toLowerCase().includes(name.toLowerCase())
                );
            }

            if (year) {
                filteredMovies = filteredMovies.filter(movie => movie.year === year);
            }

            callback(filteredMovies);
        });
}

module.exports = { getAllMoviesService, getMovieByIdService, getMovieByTitleService, searchMoviesService };
