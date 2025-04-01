const http = require('http');
const { getRandomMovie } = require('./movieUtils'); // Importar la función desde movieUtils

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        getRandomMovie((movie) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(movie));
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
