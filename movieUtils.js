const fs = require('fs');
const csv = require('csv-parser');

// Función para obtener detalles de la película por título
function getMovieByTitle(title, callback) {
    const results = [];
    const imageMap = {};

    // Leer el archivo de imágenes y construir un mapa de títulos a URLs
    const imageFileContent = fs.readFileSync('./data/csv con imagenes.txt', 'utf-8');
    imageFileContent.split('\n').forEach(line => {
        const [movieTitle, imageUrl] = line.split(/\s{2,}/); // Separar por espacios múltiples
        if (movieTitle && imageUrl) {
            imageMap[movieTitle.trim().toLowerCase()] = imageUrl.trim(); // Guardar en minúsculas
        }
    });

    // Leer el archivo CSV de películas
    fs.createReadStream('./data/movies.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            const movie = results.find(movie => movie.title.trim().toLowerCase() === title.trim().toLowerCase());
            if (movie) {
                movie.image = imageMap[movie.title.trim().toLowerCase()] || null; // Buscar la imagen en minúsculas
            }
            callback(movie || null);
        });
}

// Función para obtener detalles de la película por ID
function getMovieById(id, callback) {
    const results = [];
    fs.createReadStream('./data/movies.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            const movie = results.find(movie => movie.id.trim() === id.trim());
            callback(movie || null);
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

// Función para calcular la distancia de Levenshtein
function levenshteinDistance(a, b) {
    const matrix = Array(a.length + 1).fill(null).map(() =>
        Array(b.length + 1).fill(null)
    );

    for (let i = 0; i <= a.length; i++) {
        matrix[i][0] = i;
    }
    for (let j = 0; j <= b.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1, // Eliminación
                matrix[i][j - 1] + 1, // Inserción
                matrix[i - 1][j - 1] + cost // Sustitución
            );
        }
    }

    return matrix[a.length][b.length];
}

// Modificar la función para obtener sugerencias de películas
function getMovieSuggestions(query, callback) {
    const results = [];
    fs.createReadStream('./data/movies.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            let suggestions = [];

            if (!isNaN(query)) {
                // Si el query es un número, buscar años que comiencen con el número ingresado
                const yearQuery = query.toString();
                suggestions = results.filter(movie =>
                    movie.year.startsWith(yearQuery)
                );
            } else {
                // Si el query es un texto, buscar coincidencias exactas, parciales y cercanas
                const lowerQuery = query.toLowerCase();

                // Coincidencias exactas al inicio del título
                const exactMatches = results.filter(movie =>
                    movie.title.toLowerCase().startsWith(lowerQuery)
                );

                // Coincidencias parciales en cualquier parte del título
                const partialMatches = results.filter(movie =>
                    movie.title.toLowerCase().includes(lowerQuery)
                );

                // Coincidencias basadas en similitud (distancia de Levenshtein)
                const similarMovies = results
                    .map(movie => ({
                        movie,
                        distance: levenshteinDistance(
                            movie.title.toLowerCase(),
                            lowerQuery
                        )
                    }))
                    .filter(item => item.distance <= Math.max(2, Math.floor(lowerQuery.length / 3))) // Tolerancia ajustada
                    .sort((a, b) => a.distance - b.distance) // Ordenar por similitud
                    .map(item => item.movie);

                // Combinar resultados exactos, parciales y similares, eliminando duplicados
                suggestions = [...new Set([...exactMatches, ...partialMatches, ...similarMovies])].slice(0, 5);
            }

            callback(suggestions);
        });
}

// Función para obtener películas por año
function getMoviesByYear(year, callback) {
    const results = [];
    fs.createReadStream('./data/movies.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            const exactMatches = results.filter(movie => movie.year === year);
            if (exactMatches.length === 0) {
                const similarMatches = results.filter(movie =>
                    Math.abs(parseInt(movie.year) - parseInt(year)) <= 2
                );
                callback(similarMatches);
            } else {
                callback(exactMatches);
            }
        });
}

// Función para buscar películas por nombre y año
function searchMoviesByNameAndYear(name, year, callback) {
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
                const exactMatches = filteredMovies.filter(movie => movie.year === year);
                if (exactMatches.length === 0) {
                    filteredMovies = filteredMovies.filter(movie =>
                        Math.abs(parseInt(movie.year) - parseInt(year)) <= 2
                    );
                } else {
                    filteredMovies = exactMatches;
                }
            }

            callback(filteredMovies);
        });
}

// Exportar las funciones
module.exports = {
    getMovieByTitle,
    getMovieById,
    getAllMovies,
    getMovieSuggestions,
    getMoviesByYear,
    searchMoviesByNameAndYear
};