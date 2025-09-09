
'use strict'; 
/* *********************** Serveur Web *************************** */

console.log('TP Ciel');

var express = require('express');

// Cr�ation de l�application  express 
var exp = express();

// D�finition du port (variable configurable)

//  Param�trer le r�pertoire racine du site avec la m�thode use : 
exp.use(express.static(__dirname + '/www'));

//   Param�trer la r�ponse � une requ�te GET avec une url sur la racine et sans nom de fichier : 
exp.get('/', function (req, res) {
    console.log('R�ponse � un client');
    res.sendFile(__dirname + '/www/textchat.html');
});

//  Ajouter le traitement en cas d�erreur sur le serveur
exp.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Erreur serveur express');
});

// Mettre le serveur web en �coute sur le port 80 : 


/*  *************** serveur WebSocket express *********************   */
// 

/*  *************** serveur WebSocket express *********************   */
// 
var expressWs = require('express-ws')(exp);

// Connexion des clients � la WebSocket /echo et evenements associ�s 
exp.ws('/echo', function (ws, req) {
    console.log('Connection WebSocket %s sur le port %s', req.connection.remoteAddress, req.connection.remotePort);

    ws.on('message', function (message) {
        console.log('De %s %s, message :%s', req.connection.remoteAddress, req.connection.remotePort, message);
        ws.send(message); // Echo du message
        message = ws._socket._peername.address + ws._socket._peername.port + ' : ' + message;
        aWss.broadcast(message);
    });
 

    ws.on('close', function () {
        console.log('Deconnexion WebSocket %s sur le port %s', req.connection.remoteAddress, req.connection.remotePort);
    });
});
var portServ = 80;
exp.listen(portServ, function () {
    console.log('Serveur en ecoute');
});
/*  ****************** Broadcast clients WebSocket  **************   */
var aWss = expressWs.getWss('/echo'); 
var WebSocket = require('ws');

aWss.broadcast = function broadcast(data) {
    console.log("Broadcast aux clients navigateur : %s", data);
    aWss.clients.forEach(function each(client) {
        if (client.readyState == WebSocket.OPEN) {
            client.send(data, function ack(error) {
                console.log("    -  %s-%s", client._socket.remoteAddress,
                    client._socket.remotePort);
                if (error) {
                    console.log('ERREUR websocket broadcast : %s', error.toString());
                }
            });
        }
    });
}; 

