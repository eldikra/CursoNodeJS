const express = require('express')
const ruta = express.Router()
const Joi = require('joi')

const usuario = [
    {id:1,Nombre:'Diego'},
    {id:2,Nombre:'Oriana'},
    {id:3,Nombre:'Yamila'}
]

// ruta.get()//peticio
// ruta.post()//envio de datos
// ruta.put()//actualizacion
// ruta.delete()//borrado de datos

// ruta.get('/', (req,res) => {
//     res.send('Funciona!! Lpm')
// })//http://localhost:3005/
ruta.get('/api/usuarios', (req,res) =>{
    res.send(JSON.stringify(['Diego','Oriana','Yamila']))
})//http://localhost:3005/api/usuarios/

ruta.get('/api/usuarios/:id',(req,res) =>{
    res.send(req.params.id)
})//http://localhost:3005/api/usuarios/10

ruta.get('/:id',(req,res)=>{
    let user = UsuarioExist(req.params.id)
    if(!user) res.status(404).send('usuario no encontrado')
    res.send(user)
})

// ruta.get('/s/:year/:month',(req,res) =>{
//     res.send(req.params)
// })//http://localhost:3005/api/usuarios/1986/4

ruta.get('/:year/:month',(req,res) =>{
    res.send(req.query)
}) //http://localhost:3005/api/usuarios/1986/4?sexo=Masculino

ruta.get('/',(req,res) =>{
    res.send(usuario)
}) //http://localhost:3005/api/usuario

ruta.post('/',(req,res)=>{
    const schema = Joi.object({
        Nombre: Joi.string().min(3).max(12).required().empty()
    })
    
    const {error,value} = ValidarUsuario(req.body.Nombre)
    if(!error){
        const user = {
            id: usuario.length + 1,
            Nombre: value.Nombre
        }
        usuario.push(user)
        res.send(user)
    }else{
        res.status(400).send(error.message)
    }
}) //http://localhost:3005/api/usuario RAW JSON "Nombre" = "NOMBRE A AGREGAR"


ruta.put('/:id',(req,res) =>{
    let user = UsuarioExist(req.params.id)
    if(!user) {
        res.status(404).send('Usuario inexistente')
        return
    }

    const {error,value} = ValidarUsuario(req.body.Nombre)
    if(error){
        const mensaje = error.details[0].message
        res.status(400).send(mensaje)
        return
    }
    user.Nombre = value.Nombre
    res.send(user)
})

ruta.delete('/:id',(req,res) =>{
    let user = UsuarioExist(req.params.id)
    if(!user) {
        res.status(404).send('Usuario inexistente')
        return
    }

    const index = usuario.indexOf(user)
    usuario.splice(index,1)
    res.send(`Usuario ${user.Nombre} fue eliminado`)
})

function UsuarioExist(id){
    return (usuario.find(u => u.id === parseInt(id)))
}

function ValidarUsuario(nom){
    const schema = Joi.object({
        Nombre: Joi.string().min(3).max(12).required().empty()
    })
    return (schema.validate({Nombre: nom}))
}

module.exports = ruta