//set DEBUG=app:* para iniciar ambos
const debug = require('debug')('app:inicio') //set DEBUG=app:Iniciando
//const dbDebug = require('debug')('app:db') //set DEBUG=app:Iniciando
const express = require('Express') 
//const logger = require('./Logger')
const morgan = require('morgan')
const config = require('config')
const Joi = require('joi')
const app = express()

app.use(express.json()) //para que utilice este middleware
app.use(express.urlencoded({extended:true}))
app.use(express.static('Public'))
 
// configuracion de entornos | set NODE_ENV=**NOMBRE DEL ARCHIVO CONFIG**
console.log('Applicacion: ' + config.get('nombre'))
console.log('DB Server: ' + config.get('configDB.host'))

//uso de middleware de 3ro - morgan
if(app.get('env') === 'development'){
    app.use(morgan('tiny'))
    //console.log('morgan enabled!')
    debug('morgan enabled!')
}
//Trabajos con la base de datos
debug('Conectando con la BD!')



//app.use(logger)

// app.use(function(req, res, next){
//     console.log("Autenticando....");
//     next();
// })

const usuario = [
    {id:1,Nombre:'Diego'},
    {id:2,Nombre:'Oriana'},
    {id:3,Nombre:'Yamila'}
]

// app.get()//peticio
// app.post()//envio de datos
// app.put()//actualizacion
// app.delete()//borrado de datos

app.get('/', (req,res) => {
    res.send('Funciona!! Lpm')
})//http://localhost:3005/
app.get('/api/usuarios', (req,res) =>{
    res.send(JSON.stringify(['Diego','Oriana','Yamila']))
})//http://localhost:3005/api/usuarios/

app.get('/api/usuarios/:id',(req,res) =>{
    res.send(req.params.id)
})//http://localhost:3005/api/usuarios/10

app.get('/api/usuario/:id',(req,res)=>{
    let user = UsuarioExist(req.params.id)
    if(!user) res.status(404).send('usuario no encontrado')
    res.send(user)
})

// app.get('/api/usuarios/:year/:month',(req,res) =>{
//     res.send(req.params)
// })//http://localhost:3005/api/usuarios/1986/4

app.get('/api/usuarios/:year/:month',(req,res) =>{
    res.send(req.query)
}) //http://localhost:3005/api/usuarios/1986/4?sexo=Masculino

app.get('/api/usuario',(req,res) =>{
    res.send(usuario)
}) //http://localhost:3005/api/usuario

app.post('/api/usuario',(req,res)=>{
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


app.put('/api/usuario/:id',(req,res) =>{
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

app.delete('/api/usuario/:id',(req,res) =>{
    let user = UsuarioExist(req.params.id)
    if(!user) {
        res.status(404).send('Usuario inexistente')
        return
    }

    const index = usuario.indexOf(user)
    usuario.splice(index,1)
    res.send(`Usuario ${user.Nombre} fue eliminado`)
})
//En cmd set PORT=3005

const port = process.env.port || 3000;
app.listen(port,()=>{
    console.log(`escuchando en el puerto ${port}...`)
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