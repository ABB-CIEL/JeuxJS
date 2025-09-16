
'use strict'; 
/* *********************** Serveur Web *************************** */

console.log('TP Ciel');

var express = require('express');

// Création de l’application  express 
var exp = express();

// Définition du port (variable configurable)

//  Paramétrer le répertoire racine du site avec la méthode use : 
exp.use(express.static(__dirname + '/www'));

//   Paramétrer la réponse à une requête GET avec une url sur la racine et sans nom de fichier : 
exp.get('/', function (req, res) {
    console.log('Réponse à un client');
    res.sendFile(__dirname + '/www/textchat.html');
});

//  Ajouter le traitement en cas d’erreur sur le serveur
exp.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Erreur serveur express');
});

// Mettre le serveur web en écoute sur le port 80 : 


/*  *************** serveur WebSocket express *********************   */
// 

/*  *************** serveur WebSocket express *********************   */
// 
var expressWs = require('express-ws')(exp);

// Connexion des clients à la WebSocket /echo et evenements associés 
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

var question = '?';
var bonneReponse = 0;
// Connexion des clients a la WebSocket /qr et evenements associés
// Questions/reponses


exp.ws('/qr', function (ws, req) {
    console.log('Connection WebSocket %s sur le port %s',
        req.connection.remoteAddress, req.connection.remotePort);

    NouvelleQuestion(ws);

    ws.on('message', function (message) {
        console.log('De %s %s, message :%s', req.connection.remoteAddress,
            req.connection.remotePort, message);

        let reponse = parseInt(message);
        let messageClient = '';

        if (reponse === bonneReponse) {
            messageClient = 'Bonne réponse !';
        } else {
            messageClient = 'Mauvaise réponse !';
        }

        // Envoyer uniquement au client qui a répondu
        ws.send(messageClient);

        // Attendre 3 secondes avant d'envoyer une nouvelle question
        setTimeout(() => {
            NouvelleQuestion(ws);
        }, 3000);
    });

    ws.on('close', function () {
        console.log('Deconnexion WebSocket %s sur le port %s',
            req.connection.remoteAddress, req.connection.remotePort);
    });

    function NouvelleQuestion(wsClient) {
        var x = GetRandomInt(11);
        var y = GetRandomInt(11);
        question = x + '*' + y + ' = ?';
        bonneReponse = x * y;

        // Envoyer la nouvelle question uniquement au client concerné
        wsClient.send(question);
    }

    function GetRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
});
function NouvelleQuestionBinaire(wsClient) {
    const entier = Math.floor(Math.random() * 256); // nombre entre 0 et 255
    let binaire = '';

    // Construction manuelle de la chaîne binaire sur 8 bits
    for (let i = 7; i >= 0; i--) {
        binaire += ((entier >> i) & 1);
    }

    question = `Convertir le nombre binaire ${binaire} en base 10`;
    bonneReponse = entier;

    wsClient.send(question);

}

