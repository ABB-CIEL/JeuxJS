
'use strict'; 
/* *********************** Serveur Web *************************** */

console.log('TP Ciel');

var express = require('express');

// Cr�ation de l�application  express 
var exp = express();

// D�finition du port (variable configurable)
var port = 80;

//  Param�trer le r�pertoire racine du site avec la m�thode use : 
exp.use(express.static(__dirname + '/www'));

//   Param�trer la r�ponse � une requ�te GET avec une url sur la racine et sans nom de fichier : 
exp.get('/', function (req, res) {
    console.log('R�ponse � un client');
    res.sendFile(__dirname + '/www/index.html');
});

//  Ajouter le traitement en cas d�erreur sur le serveur
exp.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Erreur serveur express');
});

// Mettre le serveur web en �coute sur le port 80 : 
exp.listen(port, function () {
    console.log('Serveur en ecoute  ' + port);
});