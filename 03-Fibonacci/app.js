const serie = require ('./serie')

let argv = process.argv

let valor = argv[2].split('=')[1]

console.log(valor)

serie.CrearSerie(valor)
    .then(mensaje => console.log(mensaje))
    .catch(mensaje => console.log(mensaje))