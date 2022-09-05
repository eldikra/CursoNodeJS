const jwt = require('jsonwebtoken')
const config = require('config')

let verificarToken = (req, res, next) => {   // Verificacion de toquen
    let token = req.get('Autorization')
    jwt.verify(token, config.get('configToken.SEED'), (err, decoded) => {
        if (err) {
            return res.status(401).json({
                err
            })
        }
        req.usuario = decoded.usuario //trae el usuario del payload
        next()
    })
}

module.exports = verificarToken