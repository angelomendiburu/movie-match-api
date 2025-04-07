const fs = require('fs');
const csv = require('csv-parser');

// Mapeo de títulos de películas a URLs de imágenes
const movieImages = {
    "The Shawshank Redemption": "https://static.wikia.nocookie.net/doblaje/images/5/56/The-Shawshank-Redemption-Latino1994.jpg/revision/latest?cb=20240224231124&path-prefix=es",
    "The Godfather": "https://i.pinimg.com/736x/fe/97/b4/fe97b4c9d2953e94e4ab5d01f6333556.jpg",
    "The Dark Knight": "https://play-lh.googleusercontent.com/auIs5tjWlLYaFPGClZOJ7m5YVbnX6uBvz0X02r8TkwFKdzE53ww2MqWSS9gU0YNqoYwvpg",
    "The Godfather Part II": "https://m.media-amazon.com/images/M/MV5BMDIxMzBlZDktZjMxNy00ZGI4LTgxNDEtYWRlNzRjMjJmOGQ1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    "12 Angry Men": "https://upload.wikimedia.org/wikipedia/commons/b/b5/12_Angry_Men_%281957_film_poster%29.jpg",
    "Schindler's List": "https://biblioteca.ucm.es/cee/file/la-lista-de-schindler?ver=n",
    "The Lord of the Rings: The Return of the King": "https://images.cdn3.buscalibre.com/fit-in/360x360/2c/c8/2cc8d8b40389605434add789a1fc055d.jpg",
    "Pulp Fiction": "https://m.media-amazon.com/images/I/71zSZQzlK+L.jpg",
    "The Good, the Bad and the Ugly": "https://play-lh.googleusercontent.com/9nQQZcj7h2CvSFhXiMD1PVThI_oc0enVk0cY_oGZoAqJ0SCin-tDi3K7bC4PlnF1dRO2",
    "The Lord of the Rings: The Fellowship of the Ring": "https://i.pinimg.com/564x/ff/72/dc/ff72dccba2638b7aa656f55c282027cd.jpg",
    "Forrest Gump": "https://i.pinimg.com/474x/dd/16/39/dd163911d14ba1399f5a32fcaf8fe72b.jpg",
    "Fight Club": "https://static.wikia.nocookie.net/cine/images/f/f8/Fight-Club-1999.jpg/revision/latest?cb=20121017183904",
    "Inception": "https://www.originalfilmart.com/cdn/shop/products/inception_2010_imax_original_film_art_5000x.jpg?v=1551890318",
    "Alien": "https://static.wikia.nocookie.net/alien-isolation/images/e/e0/Alien1Pbk.jpg/revision/latest?cb=20211213012912&path-prefix=es"
    // Agrega más películas según sea necesario
};

function getAllMoviesService(callback) {
    const results = [];
    fs.createReadStream('./data/movies.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            callback(results); // Retornar todas las películas
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
    const imageMap = {};

    // Leer el archivo de imágenes y construir un mapa de títulos a URLs
    const imageFileContent = fs.readFileSync('./data/csv con imagenes.txt', 'utf-8');
    imageFileContent.split('\n').forEach(line => {
        const [movieTitle, imageUrl] = line.split(/\s{2,}/); // Separar por espacios múltiples
        if (movieTitle && imageUrl) {
            imageMap[movieTitle.trim()] = imageUrl.trim();
        }
    });

    // Leer el archivo CSV de películas
    fs.createReadStream('./data/movies.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            const movie = results.find(movie => movie.title.toLowerCase() === title.toLowerCase());
            if (movie) {
                movie.image = imageMap[movie.title] || null; // Agregar la URL de la imagen si existe
            }
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

            // Ordenar por similitud al nombre proporcionado
            if (name) {
                filteredMovies.sort((a, b) => {
                    const aDistance = levenshteinDistance(a.title.toLowerCase(), name.toLowerCase());
                    const bDistance = levenshteinDistance(b.title.toLowerCase(), name.toLowerCase());
                    return aDistance - bDistance;
                });
            }

            callback(filteredMovies.slice(0, 1)); // Retornar solo la película más acertada
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

function getMovieSuggestions(query, callback) {
    const results = [];
    fs.createReadStream('./data/movies.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            const suggestions = results.filter(movie =>
                movie.title.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 5); // Limitar a 5 sugerencias
            callback(suggestions);
        });
}

module.exports = { 
    getAllMoviesService, 
    getMovieByIdService, 
    getMovieByTitleService, 
    searchMoviesService, 
    getMovieSuggestions 
};
