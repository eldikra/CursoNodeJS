const express = require('express')
const Curso = require('../model/curso_model')
const ruta = express.Router()
const joi = require('joi')
const verificarToken = require('../middlewares/auth')

const schema = joi.object({
    titulo: joi.string().min(4).required(),
    descripcion: joi.string().min(10).max(40),

})


ruta.get('/', verificarToken ,(req, res) => {
    const listaCursos = listarCursos()
    listaCursos.then(cursos => {
        res.json(cursos)
    }).catch(err => {
        res.status(400).send(err.details[0].message)
    })
})

ruta.get('/active',verificarToken , (req, res) => {
    const listaCursos = listarCursosActivos()
    listaCursos.then(cursos => {
        res.json(cursos)
    }).catch(err => {
        res.status(400).send(err.details[0].message)
    })
})

ruta.get('/inactive',verificarToken , (req, res) => {
    const listaCursos = listarCursosInactivos()
    listaCursos.then(cursos => {
        res.json(cursos)
    }).catch(err => {
        res.status(400).send(err.details[0].message)
    })
})
ruta.post('/',verificarToken , (req, res) => {
    const { error, value } = schema.validate({ titulo: req.body.titulo, descripcion: req.body.desc })
    if (!error) {
        let cursoNuevo = crearCurso(req.body)
        cursoNuevo.then(curso => {
            res.json({
                curso
            })
        }).catch(err => {
            res.status(400).send(err.details[0].message)
        })

    } else {
        res.status(400).send(error.details[0].message)
    }
})

ruta.put('/:id', verificarToken ,(req, res) => {
    const { error, value } = schema.validate({ titulo: req.body.titulo, descripcion: req.body.desc })
    if (!error) {
        const resultado = actualizarCurso(req.params.id, req.body)
        resultado.then(cursoNuevo => {
            res.json(cursoNuevo)
        }).catch(err => {
            err
        })
    } else {
        res.status(400).send(error.details[0].message)
    }
})

ruta.delete('/:id', verificarToken ,(req, res) => {
    const resultado = desactivarCurso(req.params.id)
    resultado.then(cursoEliminado => {
        res.json({ cursoEliminado })
    }).catch(err => {
        res.status(400).json({ err })
    })
})

async function crearCurso(body) {
    let curso = new Curso({
        titulo: body.titulo,
        descripcion: body.desc,
    })
    return await curso.save()
}

async function actualizarCurso(id, body) {
    let curso = await Curso.findByIdAndUpdate(id, {
        $set: {
            titulo: body.titulo,
            descripcion: body.desc
        }
    }, { new: true })
    return curso
}

async function desactivarCurso(id) {
    let cursoAEliminar = await Curso.findByIdAndUpdate(id, {
        $set: {
            estado: false
        }
    }, { new: true })
    return cursoAEliminar
}
async function listarCursos() {
    let listaCursos = await Curso.find()
    return listaCursos
}
async function listarCursosActivos() {
    let listaCursos = await Curso.find({estado: true})
    return listaCursos
}
async function listarCursosInactivos() {
    let listaCursos = await Curso.find({estado: false})
    return listaCursos
}



module.exports = ruta