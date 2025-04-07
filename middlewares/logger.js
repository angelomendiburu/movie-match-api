// Middleware para registrar las solicitudes HTTP

function logger(req, res, next) {
    // Obtener la marca de tiempo actual en formato ISO
    const timestamp = new Date().toISOString();
    
    // Imprimir en la consola el método HTTP y la URL de la solicitud
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    // escribir en un archivo del escritorio
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, '../output/requests.log');
    fs.appendFile(filePath, `[${timestamp}] ${req.method} ${req.url}\n`, (err) => {
        if (err) throw err;
    });
    
    // Pasar al siguiente middleware o controlador
    next();
};

module.exports = logger;