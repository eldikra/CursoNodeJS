const mongoose = require('mongoose')


const cursoSchema = new mongoose.Schema({
    titulo:{
        type: String,
        require: true
    },
    descripcion:{
        type: String,
        require: false
    },
    estado:{
        type: Boolean,
        default: true
    },
    imagen:{
        type: String,
        require: false
    },
    alumnos:{
        type: Number,
        default: 0
    },
    califica:{
        type:Number,
        default:0
    }

})

module.exports = mongoose.model('Curso',cursoSchema)