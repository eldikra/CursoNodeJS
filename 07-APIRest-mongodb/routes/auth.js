const express = require('express')
const config = require('config')
const bcrypt = require('bcrypt')
const Usuario = require('../model/usuario_model')
const ruta = express.Router()
// const Joi = require('joi')


const jwt = require('jsonwebtoken')

ruta.post('/',(req,res)=>{
    Usuario.findOne({email: req.body.email}) //Busca el usuario
        .then(datos =>{ // si lo encuentra
            if(datos){
                const passwordValido =bcrypt.compareSync(req.body.password,datos.password) //compara el password
                if(!passwordValido){ //si es valido
                    return res.status(400).json({error:'ok',msj:'Usuario o contraseña incorrecta'})}
                    const jswt =jwt.sign({
                        data:{id: datos._id,nombre: datos.nombre, email: datos.email}
                    },config.get('configToken.SEED'),{expiresIn: config.get('configToken.expiration')}) //genera el token con la info trayendo el secret y el expiration de config *Ambiente*
                    // jwt.sign({id: datos._id,nombre: datos.nombre, email: datos.email},'password')
                    //res.send(jswt)
                    res.json({
                        usuario:{
                            _id: datos.id,
                            nombres: datos.nombre,
                            email:datos.email
                        },
                        jswt // devuelve toda la informacion
                    })
            }else{
                res.status(400).json({ // usuario no encontrado
                    error:'ok',
                    msj:'Usuario o contraseña incorrecta'
                })
            }
        })
        .catch(err =>{
            res.status(400).json({
                error:'ok',
                msj:'Error en el servicio ' + err
            })
        })
})




module.exports = ruta