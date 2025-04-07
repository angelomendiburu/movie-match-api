const http = require('http');
const express = require('express'); // Import Express
const swaggerUi = require('swagger-ui-express'); // Import Swagger UI
const swaggerDocument = require('./docs/swagger.yaml'); // Cambiar a YAML
const { getRandomMovie } = require('./movieUtils'); // Importar la función desde movieUtils
const fs = require('fs');
const csv = require('csv-parser');

const app = express(); // Initialize Express
const PORT = process.env.PORT || 3000;

// Serve Swagger UI at /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Define the root endpoint
app.get('/', (req, res) => {
    getRandomMovie((movie) => {
        res.status(200).json(movie);
    });
});

app.get('/movies', (req, res) => {
    const genre = req.query.genre;
    if (!genre) {
        return res.status(400).send('Por favor, especifica un género.');
    }

    const filePath = `./data/${genre}.csv`;
    if (!fs.existsSync(filePath)) {
        return res.status(404).send(`No se encontró el archivo para el género: ${genre}`);
    }

    const movies = [];
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => movies.push(data))
        .on('end', () => {
            res.json(movies);
        })
        .on('error', (err) => {
            res.status(500).send('Error al leer el archivo.');
        });
});

// Handle 404 for other routes
app.use((req, res) => {
    res.status(404).send('Not Found');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Documentación disponible en http://localhost:${PORT}/docs`);
});
