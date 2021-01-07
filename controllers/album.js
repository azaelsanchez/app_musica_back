'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination')
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res){
    res.status(200).send({message: 'Peticion correcta'});

}

function saveAlbum(req, res){
    var album = new Album();

    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err, albumStore) =>{
        if(err){
            res.status(500).send({message: 'Peticion incorrecta'});
        }else{
            if(!albumStore){
                res.status(404).send({message: 'Album no guardado'});
            }else{
                res.status(200).send({album: albumStore});
            }
        }
    });
}

module.exports = {
    getAlbum,
    saveAlbum
}