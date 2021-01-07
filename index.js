'use strict'

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Appmusical', (err, res)=> {
    if(err){
        throw err;
    }else{
        console.log("Conexión correcta con la base de datos");
    }
});