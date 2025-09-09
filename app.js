
'use strict'; 
/* *********************** Serveur Web *************************** */

console.log('TP Ciel');

var express = require('express');

// Création de l’application  express 
var exp = express();

// Définition du port (variable configurable)
var port = 80;

//  Paramétrer le répertoire racine du site avec la méthode use : 
exp.use(express.static(__dirname + '/www'));

//   Paramétrer la réponse à une requête GET avec une url sur la racine et sans nom de fichier : 
exp.get('/', function (req, res) {
    console.log('Réponse à un client');
    res.sendFile(__dirname + '/www/index.html');
});

//  Ajouter le traitement en cas d’erreur sur le serveur
exp.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Erreur serveur express');
});

// Mettre le serveur web en écoute sur le port 80 : 
exp.listen(port, function () {
    console.log('Serveur en ecoute  ' + port);
});