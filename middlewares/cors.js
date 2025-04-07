// Middleware para habilitar CORS (Cross-Origin Resource Sharing)
module.exports = (req, res, next) => {
    // Permitir solicitudes desde cualquier origen
    res.header("Access-Control-Allow-Origin", "*");
    
    // Permitir los métodos HTTP especificados
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    
    // Permitir los encabezados especificados en las solicitudes
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    // Permitir el uso de credenciales (cookies, cabeceras de autenticación, etc.)
    res.header("Access-Control-Allow-Credentials", "true");
    
    // Responder con un estado 204 para las solicitudes OPTIONS (preflight)
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    
    // Pasar al siguiente middleware o controlador
    next();
};