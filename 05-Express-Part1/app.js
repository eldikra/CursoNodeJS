//set DEBUG=app:* para iniciar ambos
const debug = require('debug')('app:inicio') //set DEBUG=app:Iniciando
//const dbDebug = require('debug')('app:db') //set DEBUG=app:Iniciando
const usuarios = require('./routes/usuarios')
const express = require('Express') 
//const logger = require('./Logger')
const morgan = require('morgan')
const config = require('config')

const app = express()

app.use(express.json()) //para que utilice este middleware
app.use(express.urlencoded({extended:true}))
app.use(express.static('Public'))
app.use('/api/usuario/',usuarios)
 
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
//En cmd set PORT=3005

const port = process.env.port || 3000;
app.listen(port,()=>{
    console.log(`escuchando en el puerto ${port}...`)
})

