// Funcion con promesa y Async / Await
//
function mensaje(){
    return new Promise((resolve, reject) =>{
        setTimeout(()=>{
            if(false)
                resolve ("Se va a ejecutar despues de 3 seg")
            else
                reject('Hubo un error');
            }, 3000);
    })
}

async function llamadaAsync(){
    console.log('Llamada...');
    const resultado = await mensaje();
    return(resultado);
}
llamadaAsync().then(x => console.log(x)).catch(e => console.log(e));