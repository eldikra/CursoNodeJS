const http = require('http')
const { json } = require('stream/consumers')
const server = http.createServer((req,res) =>{
    if(req.url === '/'){
        res.statusCode = 200
        res.write('Ahora si')
        res.end()

    }
    if (req.url === '/test'){
        res.statusCode = 200
        res.write('Test Page')
        res.end()
    }
    if(req.url === '/api/productos'){
        res.write(JSON.stringify(['Mouse','Teclado','Monitor']))
        res.end()
    }
})
server.on('connection',(puerto) => {
    console.log('New Connection')
})

server.listen(3001)
console.log()