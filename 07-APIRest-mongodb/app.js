// setear la variable que establece el entorno en el que laburamos SET NODE_ENV=development
const usuarios = require('./routes/usuarios')
const cursos = require('./routes/cursos')
const auth = require('./routes/auth')
const express = require('express')
const mongoose = require('mongoose')
const config = require('config')

mongoose.connect(config.get('configDB.HOST')) // Si no existe la db la crea automagicamente - configDB.HOST lo trae de config *AMBIENTE*
    .then(()=> console.log('Conectado a mongo'))
    .catch(err => console.log('No fue posible conectarse a la DB',err))

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/api/usuarios/',usuarios)
app.use('/api/cursos/',cursos)
app.use('/api/auth',auth)

const port = process.env.port || 3000
app.listen(port,()=>{
    console.log('API RESTfull ok, y ejecutando...')
})