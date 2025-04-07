// Middleware para manejar errores en la aplicación
module.exports = (err, req, res, next) => {
    // Imprimir el stack trace del error en la consola para depuración
    console.error(err.stack);

    // Enviar una respuesta JSON con el mensaje y el estado del error
    res.status(err.status || 500).json({
        error: {
            // Mensaje del error (o un mensaje genérico si no está definido)
            message: err.message || "Error interno del servidor",
            // Código de estado del error (o 500 si no está definido)
            status: err.status || 500,
        },
    });
};