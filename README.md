<h1 align="center">
Ticket Bot Master
  <br>
</h1>


<p align="center">
  <a href="#about">About</a>
  •
  <a href="#features">Features</a>
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
  "prefix": "BOT_PREFIX",
  "main_token": "BOT_TOKEN",
  "developers": "DEV_ID",
  "bot_name":"YOUR_BOT_NAME",
  "emoji":"REACTION_EMOJI",
  "color":"PREFFERED_EMBED_COLOR",
  "ticket_limit":"TICKET_LIMIT",
  "support_role_id":"SUPPORT_ROLE_ID",
  "category_id":"CATEGORY_ID",
  "log_channel_id":"TICKET_LOG_CHANNEL_ID"
}
```
 
 ### Important
 Assurez-vous d'avoir activé `Privileged Intents` sur le Discord [Developer Portal](https://discordapp.com/developers/applications/). 


Une fois cela fait, vous pouvez lancer le bot avec `node index.js`. 

Des questions? Rejoingnez le [Discord](https://discord.gg/JCC4TjYbSH)
