// Serie de Fibonacci
// 1 1 2 3 5 8 13 21 34

const { rejects } = require('assert')
const fs = require('fs')
const { resolve } = require('path')
let CrearSerie = (cantidad)=>{
    return new Promise((resolve, rejects) =>
    {
        let fibo1 = 1
        let fibo2 = 1
        let serie=''

        serie+=`${fibo1}\t`

        for (let i = 2;i <= cantidad;i++){
            serie+=`${fibo2}\t`
            fibo2 = fibo1 + fibo2
            fibo1 = fibo2 - fibo1
        }
        fs.writeFile('fibo.txt',serie,(err)=>{
            if(err) 
                reject('la cagaste') 
            else
                resolve('the file has been saved')
        })
    })
    

}

module.exports = {
    CrearSerie
}