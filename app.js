'use strict';

/* *********************** Serveur Web *************************** */
console.log('TP Ciel');

const express = require('express');
const WebSocket = require('ws');
const expressWs = require('express-ws')(express());
const exp = expressWs.app;

// Paramétrage du répertoire racine
exp.use(express.static(__dirname + '/www'));

// Route principale
exp.get('/', function (req, res) {
    console.log('Réponse à un client');
    res.sendFile(__dirname + '/www/textchat.html');
});

// Gestion des erreurs
exp.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Erreur serveur express');
});

/* *************** WebSocket /echo ********************* */
exp.ws('/echo', function (ws, req) {
    console.log('Connection WebSocket %s sur le port %s', req.connection.remoteAddress, req.connection.remotePort);

    ws.on('message', function (message) {
        console.log('De %s %s, message :%s', req.connection.remoteAddress, req.connection.remotePort, message);
        ws.send(message); // Echo
        const fullMessage = ws._socket._peername.address + ws._socket._peername.port + ' : ' + message;
        aWss.broadcast(fullMessage);
    });

    ws.on('close', function () {
        console.log('Deconnexion WebSocket %s sur le port %s', req.connection.remoteAddress, req.connection.remotePort);
    });
});

// Broadcast pour /echo
const aWss = expressWs.getWss('/echo');
aWss.broadcast = function broadcast(data) {
    console.log("Broadcast aux clients navigateur : %s", data);
    aWss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data, function ack(error) {
                console.log("    -  %s-%s", client._socket.remoteAddress, client._socket.remotePort);
                if (error) {
                    console.log('ERREUR websocket broadcast : %s', error.toString());
                }
            });
        }
    });
};

/* *************** Classe CQr pour /qr ********************* */
class CQr {
    constructor() {
        this.question = '?';
        this.bonneReponse = 0;
    }

    GetRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    NouvelleQuestion(wsClient) {
        const entier = this.GetRandomInt(256);
        let binaire = '';
        for (let i = 7; i >= 0; i--) {
            binaire += ((entier >> i) & 1);
        }

        this.question = `Convertir le nombre binaire ${binaire} en base 10`;
        this.bonneReponse = entier;

        wsClient.send(this.question);
    }

    TraiterReponse(wsClient, message) {
        const reponse = parseInt(message);
        const messageClient = (reponse === this.bonneReponse)
            ? 'Bonne réponse !'
            : 'Mauvaise réponse !';

        wsClient.send(messageClient);

        setTimeout(() => {
            this.NouvelleQuestion(wsClient);
        }, 3000);
    }
}

// Instanciation du jeu
const jeuxQr = new CQr();

/* *************** WebSocket /qr ********************* */
exp.ws('/qr', function (ws, req) {
    console.log('Connection WebSocket %s sur le port %s', req.connection.remoteAddress, req.connection.remotePort);

    jeuxQr.NouvelleQuestion(ws);

    ws.on('message', function (message) {
        jeuxQr.TraiterReponse(ws, message);
    });

    ws.on('close', function () {
        console.log('Deconnexion WebSocket %s sur le port %s', req.connection.remoteAddress, req.connection.remotePort);
    });
});

/* *************** Mise en écoute ********************* */
const portServ = 80;
exp.listen(portServ, function () {
    console.log('Serveur en ecoute sur le port', portServ);
});
