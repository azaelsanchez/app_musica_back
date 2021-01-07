'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Appmusical', (err, res)=> {
    if(err){
        throw err;
    }else{
        console.log("Conexión correcta con la base de datos");

        app.listen(port, function(){
           console.log("Conectado al servidor "+port+" Appmusical");
        });
    }
});