'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination')
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res){
    var albumId = req.params.id;

    Album.findById(albumId).populate({path: 'artist'}).exec((err, album)=>{
        if(err){
            res.status(500).send({message: 'Peticion incorrecta'});
        }else{
            if(!album){
                res.status(404).send({message: 'El Album no existe'});
            }else{
                res.status(200).send({album});
            }
        }
    })
}

function getAlbums(req, res){
    var artistId = req.params.artist;
    if(!artistId){
        //Sacar todos los albums de la bbdd
        var find = Album.find({}).sort('title');
    }else{
        //Sacar los albums de ese artista
        var find =  Album.find({artist: artistId}).sort('year');
    }

    find.populate({path: 'artist'}).exec((err, albums) => {
        if(err){
            res.status(500).send({message: 'Peticion incorrecta'});
        }else{
            if(!albums){
                res.status(404).send({message: 'El Album no existe'});
            }else{
                res.status(200).send({albums});
            }
        }
    })
}

function saveAlbum(req, res){
    var album = new Album();

    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err, albumStore) => {
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
    saveAlbum,
    getAlbums
}