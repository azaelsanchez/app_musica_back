'use strict'
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

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
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
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
function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;

    User.findByIdAndUpdate(userId, update, (err, userUpdated)=>{
        if(err){
            res.status(500).send({message:'Error actualizando usuario'});
        }else{
            if(!userUpdated){
                res.status(404).send({message:'El usuario no pudo actualizarse'});
            }else{
                res.status(200).send({message:'Usuario actualizado' , user: userUpdated});
            }
        }

    })

}

function uploadImage(req, res){
    var userId = req.params.id;
    var file_name = 'Imagen no subida';

        if(req.files){
            var file_path = req.files.image.path;
            var file_split = file_path.split('\\');
            var file_name = file_split[2];
            var ext_split = file_name.split('\.');
            var file_ext = ext_split[1];
            
            if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

                User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) =>{
                    if(!userUpdated){
                        res.status(404).send({message:'El usuario no pudo actualizarse'});
                    }else{
                        res.status(200).send({message:'Usuario actualizado' , user: userUpdated});
                    }
                });

            }else{
                res.status(200).send({message:'La extension no es valida'});
            }
        }else{
            res.status(200).send({message:'Imagen no subida'});
        }
}

function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/'+imageFile
    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message:'La imagen no existe'});
        }
    });
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};