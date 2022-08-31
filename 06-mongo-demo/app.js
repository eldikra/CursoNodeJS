// Para levantar la base
// 1) Cmd -> mongod --dbpath d:\mongodb\cursoudemy\
// 2) D:\Program Files\MongoDB\Server\6.0\bin>mongosh

const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/demo') // Si no existe la db la crea automagicamente
    .then(()=> console.log('Conectado a mongo'))
    .catch(err => console.log('No fue posible conectarse a la DB',err))


const cursoSchema = new mongoose.Schema({ // Creamos el schema de la DB
    nombre: String,
    autor:  String,
    etiquetas:[String],
    fecha:{type:Date, default:Date.now},
    publicado: Boolean
})

//Clase -> Objetos
//persona -> Pedro , Carlos

const Curso = mongoose.model('Curso',cursoSchema)

async function crearCurso(){
    const curso = new Curso({
        nombre:'Python desde cero',
        autor:'Carla Toscano',
        etiquetas:['Desarrollo Web','Back End'],
        publicado: true
    })
    const resultado = await curso.save()
    console.log(resultado)
}
crearCurso()

async function listarCursos(){
    // operadores
    // eq igual
    // ne no igual
    // gt mayor que
    // gte mayor o igual q
    // lt menor que
    // lte iguao o menor q
    // in 
    // nin no en

    //or
    //and

    const numeroPage = 2 //deberian venir en la variable
    const sizePage = 6
    //api/cursos?numeroPage=1&sizePage=10


    const cursos = await Curso
        //.find() //trae todos los cursos
        //.find({autor : 'Diego Kracoff'}) //Lista solo los de diego kracoff como autor
        //.find({publicado : true}) // Todos los publicados
        //.find({ precio: {$gte:10, $lte:30} }) // Precio mayor o igual a 10 y menor o igual a 30
        //.find({precio:{$in :[10,15,25]}}) // solo los que tienen el precio de 10, 15 y 25
        //.or([{autor:'Diego Kracoff'},{publicado: true}]) //autor diego o publicado
        //.and([{autor:'Diego Kracoff'},{publicado: true}]) //autor diego y publicado
        //.find({autor:/^Die/})  // alt+94 = ^ ---- regex autor comienza con Die
        //.find({autor: /off$/}) //regex termina con off
        
        .find({autor: /.*Kra.*/})//cuando un campo tiene un contenido especifico KRA
        .skip((numeroPage -1) * sizePage)
        .limit(sizePage)
        //.limit(10) // maximo 10 registros
        .sort({autor : 1}) //ordenado ascendente
        .select({nombre:1, etiquetas:1, autor:1}) //solo nombre y etiquetas
    console.log(cursos)
}
//listarCursos()

// async function actualizarCurso(id){
//     const curso = await Curso.findById(id)
//     if(!curso){
//         console.log('Curso inexistente')
//         return
//     }
//     curso.publicado =false
//     curso.autor = "Oriana Naudeau"

//     // curso.set({      //2da opcion para hacerlo
//     //     publicado: false,
//     //     autor: "Oriana Naudeau"
//     // })

//     const resultado = await curso.save()
//     console.log(resultado) 
// }

// actualizarCurso('630ecb3490e048e461315540')

// async function actualizarCurso2(id){
//     const resultado = await Curso.updateOne({ _id: id},{
//         $set:{
//             autor: 'Juan Addamo',
//             publicado: true
//         }
//     })

//     console.log(resultado) 
// }

// actualizarCurso2('630ecb3490e048e461315540')

async function actualizarCurso3(id){
    const resultado = await Curso.findByIdAndUpdate(id,{
        $set:{
            autor: 'Hector',
            publicado: false
        }
    },{new: true})

    console.log(resultado) 
}

//actualizarCurso3('630ecb3490e048e461315540')

async function eliminarCurso(id){
    const resultado = await Curso.findByIdAndRemove(id)
    console.log(resultado) 
}

// eliminarCurso('630ecb3d4687ae0ff3d38973')

async function eliminarCurso2(id){
    const resultado = await Curso.deleteOne({__id: id})
    console.log(resultado) 
}

//eliminarCurso2('630ecb3d4687ae0ff3d389730')



// async function borrarCurso(cursoId){
//     const curso = await Curso
//         .find({id:cursoId})
// }