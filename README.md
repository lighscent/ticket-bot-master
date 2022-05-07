<h1 align="center">
Ticket Bot Master
  <br>
</h1>


<p align="center">
  <a href="#about">A Propos</a>
  •
  <a href="#features">Caractéristiques</a>
  •
  <a href="#installation">Installation</a>
  •
  <a href="#setting-up">Mise en place</a>
</p>

## About

Ce qui suit est un bot de tickets discord qui ne fonctionne que sur un seul serveur, vous pouvez l'utiliser pour gérer vos propres tickets de serveur et également avoir la possibilité de bifurquer ce référentiel et de l'améliorer !

Si vous avez aimé ce référentiel, n'hésitez pas à laisser une étoile ⭐!

## Features

Pour avoir la liste des commandes faites `.help`
Pour mettre en place le système de ticket faites `.ticket`
Vous pouvez même tout personnaliser à partir du `config.json`.

## Installation

```
git clone https://github.com/AzukioPrs/ticket-bot-master.git
```
Ensuite faites:
```
npm install
```


## Setting Up

Paramétrez toutes vos informations dans le *config.json* 
```
{
    "color": "#COLOR",
    "prefix": "PREFIX",
    "devid": "DEV_ID",
    "token": "BOT_TOKEN"
}
```
 
 ### Important
 Assurez-vous d'avoir activé `PRESENCE INTENT`, `SERVER MEMBERS INTENT` et `MESSAGE CONTENT INTENT` sur le Discord [Developer Portal](https://discordapp.com/developers/applications/). 


Une fois cela fait, vous pouvez lancer le bot avec `node index.js`. 

Des questions? Rejoingnez le [Discord](https://discord.gg/JCC4TjYbSH)
