'use strict'
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');

function pruebas(req, res){
    res.status(200).send({
        message: 'Probando una acción del controlador usuarios'
    });
}

function saveUser(req, res){
    var user = new User();

    var params = req.body;

    console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    if(params.password){
        //encriptamos contraseña y guardamos el dato
        bcrypt.hash(params.password,null,null, function(err, hash){
            user.password = hash;

            if(user.name != null && user.surname != null && user.email != null){
                // Guarda usuario
                user.save((err, userStore) =>{
                    if(err){
                        res.status(500).send({message:'Error al guardar el usuario'});
                    }else{
                        if(!userStore){
                            res.status(404).send({message:'Usuario no registrado'});
                        }else{
                            res.status(200).send({user: userStore});
                        }
                    }
                });
            }else{
                res.status(200).send({message:'Rellena todos los campos'});
            }
        })
    }else{
        res.status(500).send({message:'Introduce la contraseña'});
    }

}

function loginUser(req, res){
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user)=>{
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!user){
                res.status(404).send({message:'El usuario no existe'});
            }else{

                //Comprobar contraseña
                bcrypt.compare(password, user.password, function(err, check){
                    if(check){
                        //Si es correcto el check devolvemos los datos del usuario logeado
                        if(params.gethash){
                            //Devolver token de jwt
                        }else{
                            res.status(200).send({user});
                        }
                    }else{
                        res.status(404).send({message:'El usuario no pudo logearse'});
                    }
                });
            }
        }
    });
}

module.exports = {
    pruebas,
    saveUser,
    loginUser
};