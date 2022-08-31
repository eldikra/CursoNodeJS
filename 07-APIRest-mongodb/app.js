const usuarios = require('./routes/usuarios')
const cursos = require('./routes/cursos')
const express = require('express')
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/demo') // Si no existe la db la crea automagicamente
    .then(()=> console.log('Conectado a mongo'))
    .catch(err => console.log('No fue posible conectarse a la DB',err))

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/api/usuarios/',usuarios)
app.use('/api/cursos/',cursos)

const port = process.env.port || 3000
app.listen(port,()=>{
    console.log('API RESTfull ok, y ejecutando...')
})