// Importa el array de usuarios desde el archivo JSON (Se carga una sola vez al iniciar)
const users = require("../modelo/users.json");

// Función controladora para manejar el login
exports.login = (req, res) =>{
    // Extrae 'cuenta' del body de la petición (protección contra body undefined
    const {cuenta} = req.body || {};
    // Acepta 'contrasena' o 'contraseña' (con/sin ñ) usando optional chaining
    const contrasena = req.body?.contrasena ?? req.body?.["contraseña"];
 
    // Valida que vengan ambos campos requeridos
    if (!cuenta || !contrasena) {
        // Responde 400 Bad request si faltan datos
        return res.status(400).json({
            error: "Faltan campos obligatorios: 'cuenta' y 'contrasena'.",
            ejemplo: {cuenta: "danna", contrasena: "danna2025"}

        });
    }

    // Busca un usuario que coincida exactamente con una cuenta y contraseña
    const match = users.find(u => u.cuenta === cuenta && u.contrasena === contrasena);

    // Si no encuentra coincidencia, credenciales incorrectas
    if (!match) {
        // responde 401 unauthorized
        return res.status(401).json({ error: "Credenciales inválidas."});
    }

    // login exitoso
    return res.status(200).json({
        mensaje: "Acceso permitido",
        usuario: { cuenta: match.cuenta} // devuelve solo la cuenta, NO la contraseña
    });

};
