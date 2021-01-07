'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_sercreta';

exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({message: 'La petición no es porsible'})
    }
    //Quitamos las comillas tanto simples como dobles que generara el token
    var token = req.headers.authorization.replace(/['"]+/g,'');

    try{
        var payload = jwt.decode(token, secret);

        if(payload.exp <= moment().unix()){
            return res.status(401).send({message: 'Token expirado'})
        }
    }catch(ex){
        return res.status(404).send({message: 'Token no valido'})
    }

    req.user = payload;

    next();
};