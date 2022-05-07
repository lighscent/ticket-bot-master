const botclient = require("./bot");
const config = require("./config.json");

// On définit le Client
const bot = new botclient(config);

// On charge les couleurs
bot.color = require('./colors.js');

// On charge les émojis
bot.emoji = require('./emojis.js');

// On lance le Bot
bot.start();
