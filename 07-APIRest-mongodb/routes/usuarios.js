const express = require('express')
const bcrypt = require('bcrypt')
const Usuario = require('../model/usuario_model')
const ruta = express.Router()
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const config = require('config')
const verificarToken = require('../middlewares/auth')

const schema = Joi.object({
    nombre: Joi.string()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ar','ch'] } })
})


ruta.get('/', verificarToken ,(req, res) => {
    res.json('Listo el get de usuarios')

})

ruta.get('/active', verificarToken, (req, res) => {
    const activos = listarUsuariosActivos()
    activos.then(activos => {
        res.json(activos)
    }).catch(err => {
        res.status(400).json({
            err
        })
    })
})

ruta.get('/inactive', verificarToken, (req, res) => {
    const inactivos = listarUsuariosInactivos()
    inactivos.then(inactivos => {
        res.json(inactivos)
    }).catch(err => {
        res.status(400).json({
            err
        })
    })
})

ruta.post('/', verificarToken ,(req, res) => {
    let body = req.body

    Usuario.findOne({ email: body.email }, (err, user) => {
        if (err) {
            console.log(err.captureStackTrace())
            return res.status(400).json({
                error: 'Server error'
            })
        }
        if (user) {
            //si user existe
            return res.status(400).json({
                mensaje: 'El usuario ya existe'
            })
        } else {
            const { error, value } = schema.validate({ nombre: body.nombre, email: body.email, password: body.password })
            if (!error) {
                let resultado = crearUsuario(body)
                resultado.then(user => {
                    res.json({
                        nombre: user.nombre,
                        email: user.email
                    })
                }).catch(err => {
                    res.status(400).json({
                        err
                    })
                })
            } else (res.status(400).send(error.details[0].message))
        }
    })
})

ruta.put('/:email', verificarToken ,(req, res) => {
    const { error, value } = schema.validate({ nombre: req.body.nombre, password: req.body.password })
    if (!error) {
        const resultado = actualizarUsuario(req.params.email, req.body)
        resultado.then(valor => {
            res.json({
                nombre: valor.nombre,
                email: valor.email
            })
        })
    } else (res.status(400).send(error.details[0].message))
})

ruta.delete('/:email', verificarToken ,(req, res) => {
    let resultado = desactivarUsuario(req.params.email)
    resultado.then(valor => {
        res.json({
            nombre: valor.nombre,
            email: valor.email
        })
    }).catch(err => {
        res.status(400).json({
            error: err
        })
    })
})

async function crearUsuario(body) {
    let usuario = new Usuario({
        email: body.email,
        nombre: body.nombre,
        password: bcrypt.hashSync(body.password, 10)
    })
    return await usuario.save()
}

async function actualizarUsuario(email, body) {
    let usuario = await Usuario.findOneAndUpdate({ "email": email }, {
        $set: {
            nombre: body.nombre,
            password: body.password
        }
    }, { new: true })
    return usuario
}

async function desactivarUsuario(email) {
    let usuario = await Usuario.findOneAndUpdate({ "email": email }, {
        $set: {
            estado: false
        }
    }, { new: true })
    return usuario
}

async function listarUsuariosActivos() {
    let usuariosAct = await Usuario.find({ estado: true })
        .select({ nombre: 1, email: 1 })
    return usuariosAct
}

async function listarUsuariosInactivos() {
    let usuariosIn = await Usuario.find({ estado: false })
        .select({ nombre: 1, email: 1 })
    return usuariosIn
}

module.exports = ruta

