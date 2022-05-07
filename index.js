const Discord = require("discord.js");
const transcript = require("discord-html-transcripts");
const config = require("./config.json");
const fs = require("fs")
const moment = require('moment')
const Client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.DIRECT_MESSAGES
    ]
});

const client = new Discord.Client({
    partials: [
        'MESSAGE',
        'USER',
        'REACTION'
    ],
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.DIRECT_MESSAGES
    ]
});

//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\

// connected
Client.login(config.token)

Client.on("ready", () => {
    console.log("Client is connected to discord!");
});

client.on('ready', () => {
    const statuses = [
        () => `.help | ${client.guilds.cache.size} Serveurs`,
        () => `.help | ${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} utilisateurs`,
        () => `Infinity Ticket`
    ]
    let i = 0
    setInterval(() => {
        client.user.setActivity(statuses[i](), { type: 'PLAYING' })
        i = ++i % statuses.length
    }, 1e4)
})

client.on('message', message => {
    if (message.type !== 'DEFAULT' || message.author.bot) return
    const args = message.content.trim().split(/ +/g)
    const commandName = args.shift().toLowerCase()
    if (!commandName.startsWith(config.prefix)) return
    const command = client.commands.get(commandName.slice(config.prefix.length))
    if (!command) return
    command.run(message, args, client)

})

//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\

Client.on("messageCreate", message => {
    if (message.content === config.prefix + "help") {
        if (message.author.bot) return
        const help = new Discord.MessageEmbed()
            .setTitle("❓ Ma page d'aide ")
            .addField("🌐 ``.ping``", `Affiche ma latence`)
            .addField("🛒 ``.ticket``", `Mets en place le menu (DEV)`)
            .addField("♨️ ``.files``", `Code Source du Bot (Premium)`)
            .setColor('#0000CD')
            .setTimestamp()
        message.channel.send({
            embeds: [help]
        })
    }
});

//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\

Client.on("messageCreate", async(message) => {
    if (message.content === config.prefix + "ping") {
        if (message.author.bot) return
        message.channel.send("Pinging...").then((m4) => {
            setTimeout(() => {
                m4.edit(`${client.ws.ping}ms de Latence`)
            })
        })
    }
});

//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\

Client.on("messageCreate", message => {
    if (message.content === config.prefix + "files") {
        if (message.author.bot) return
        const files = new Discord.MessageEmbed()
            .setTitle("♨️ Source Code")
            .addField(`Lien Paypal => https://py.pl/pxIcW`, `Pensez à ouvrir un ticket commande pour recevoir le code`)
            .setTimestamp()
        message.channel.send({
            embeds: [files]
        })
    }
});

//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\

const {
    MessageActionRow,
    MessageSelectMenu
} = require('discord.js');


// Base du système
Client.on("messageCreate", message => {
    if (message.content === config.prefix + "ticket") {
        if (message.author.bot) return;
        if (message.author.id !== config.devid) return message.channel.send("Vous n'êtes pas Dev!!!");
        const ticket01 = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                .setCustomId('ticket')
                .setPlaceholder('Besoin d\'aide pour quoi ?')
                .addOptions([{
                        label: '🛒 - Commande',
                        description: 'Passez votre commande',
                        value: 'commande',
                    },
                    {
                        label: '🙋 - SAV',
                        description: 'Aide suite à achat',
                        value: 'sav',
                    },
                    {
                        label: '📝 - Report',
                        description: 'Signaler un Bot/User',
                        value: 'report',
                    },
                    {
                        label: '💼 - Pubs/Partenariats',
                        description: 'Faire une demande Pub/Partenarait',
                        value: 'pub',
                    },
                ]),
            );

        message.channel.send({
            content: '**__InfinityTicket__** \n \n __Veuillez sélectionner une des différentes options pour ouvrir un ticket__ \n \n > **L\'ouverture de ticket sans but valable est sanctionnable** \n > **Les insultes dans les tickets sont interdites** \n > **Tout report sans preuves valables ne seront pas traité**',
            components: [ticket01]
        });
    }

});

//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\

// Ticket Commande
Client.on("interactionCreate", async interaction => {
    if (interaction.isSelectMenu()) {
        if (interaction.values == "commande") {

            var name = interaction.user.username
            var channel = await interaction.guild.channels.create(`commande-${name}`, { type: "GUILD_TEXT" })
            await channel.setParent(interaction.channel.parentId)

            await channel.permissionOverwrites.create(interaction.user, {
                SEND_MESSAGES: true,
                EMBED_LINKS: true,
                VIEW_CHANNEL: true,
                READ_MESSAGE_HISTORY: true,
            })
            await channel.permissionOverwrites.create(interaction.guild.roles.everyone, {
                SEND_MESSAGES: false,
                VIEW_CHANNEL: false,
            })

            await interaction.reply({ content: `Votre ticket a été créé avec succès \n dans le salon ${channel} !`, ephemeral: true })

            let newticket1 = new Discord.MessageEmbed()
                .setColor(config.color)
                .setTitle("🛒 - Commande")
                .setDescription(`Commande de ${interaction.user.tag}`)
                .addField(`Moyens de payements disponibles`, `Paypal, Virement Banquaire`)
                .addField(`ID User`, `${interaction.user.id}`)
                .addField(`Date de compte`, `${moment(interaction.user.createdAt).format('[Le] DD/MM/YYYY [à] HH:mm:ss')}`)
                .addField(`Rejoint le`, `${moment(interaction.joinedAt).format('[Le] DD/MM/YYYY [à] HH:mm:ss')}`)
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp()

            const btn = new Discord.MessageActionRow().addComponents(new Discord.MessageButton()
                .setStyle("DANGER")
                .setEmoji("🔒")
                .setLabel("Fermer le ticket")
                .setCustomId("close1"),
                new Discord.MessageButton()
                .setStyle("PRIMARY")
                .setEmoji("📎")
                .setLabel("Demander le transcript")
                .setCustomId("transcript1"))

            await channel.send({ embeds: [newticket1], components: [btn] })
        }
    }

    if (interaction.isButton()) {
        var tr = Client.channels.cache.find(m => m.name == "📦ㅐlogs-tickets") // il arrive pas à trouver le channel :D, Mais l'ID Marche
        if (interaction.customId === "transcript1") {
            await interaction.deferReply()
            tr.send({ content: `Transcript de ${interaction.message.embeds[0].description.split(" ")[0]}`, files: [await transcript.createTranscript(interaction.channel)] })
            await interaction.editReply("Transcript envoyé avec succès!")
        }

        if (interaction.customId === "close1") {
            interaction.channel.delete()
        }
    }
})

//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\

// Ticket SAV
Client.on("interactionCreate", async interaction => {
    if (interaction.isSelectMenu()) {
        if (interaction.values == "sav") {

            var name = interaction.user.username
            var channel = await interaction.guild.channels.create(`sav-${name}`, { type: "GUILD_TEXT" })
            await channel.setParent(interaction.channel.parentId)

            await channel.permissionOverwrites.create(interaction.user, {
                SEND_MESSAGES: true,
                EMBED_LINKS: true,
                VIEW_CHANNEL: true,
                READ_MESSAGE_HISTORY: true,
            })
            await channel.permissionOverwrites.create(interaction.guild.roles.everyone, {
                SEND_MESSAGES: false,
                VIEW_CHANNEL: false,
            })

            await interaction.reply({ content: `Votre ticket a été créé avec succès \n dans le salon ${channel} !`, ephemeral: true })

            let newticket2 = new Discord.MessageEmbed()
                .setColor(config.color)
                .setTitle("🙋 - SAV")
                .setDescription(`SAV de ${interaction.user.tag}`)
                .addField(`Moyens de payements disponibles`, `Paypal, Virement Banquaire`)
                .addField(`ID User`, `${interaction.user.id}`)
                .addField(`Date de compte`, `${moment(interaction.user.createdAt).format('[Le] DD/MM/YYYY [à] HH:mm:ss')}`)
                .addField(`Rejoint le`, `${moment(interaction.joinedAt).format('[Le] DD/MM/YYYY [à] HH:mm:ss')}`)
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp()

            const btn = new Discord.MessageActionRow().addComponents(new Discord.MessageButton()
                .setStyle("DANGER")
                .setEmoji("🔒")
                .setLabel("Fermer le ticket")
                .setCustomId("close2"),
                new Discord.MessageButton()
                .setStyle("PRIMARY")
                .setEmoji("📎")
                .setLabel("Demander le transcript")
                .setCustomId("transcript2"))

            await channel.send({ embeds: [newticket2], components: [btn] })
        }
    }

    if (interaction.isButton()) {
        var tr = Client.channels.cache.find(m => m.name == "📦ㅐlogs-tickets") // il arrive pas à trouver le channel :D, Mais l'ID Marche
        if (interaction.customId === "transcript2") {
            await interaction.deferReply()
            tr.send({ content: `Transcript de ${interaction.message.embeds[0].description.split(" ")[0]}`, files: [await transcript.createTranscript(interaction.channel)] })
            await interaction.editReply("Transcript envoyé avec succès!")
        }

        if (interaction.customId === "close2") {
            interaction.channel.delete()
        }
    }
})

//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\

// Ticket Report
Client.on("interactionCreate", async interaction => {
    if (interaction.isSelectMenu()) {
        if (interaction.values == "report") {

            var name = interaction.user.username
            var channel = await interaction.guild.channels.create(`report-${name}`, { type: "GUILD_TEXT" })
            await channel.setParent(interaction.channel.parentId)

            await channel.permissionOverwrites.create(interaction.user, {
                SEND_MESSAGES: true,
                EMBED_LINKS: true,
                VIEW_CHANNEL: true,
                READ_MESSAGE_HISTORY: true,
            })
            await channel.permissionOverwrites.create(interaction.guild.roles.everyone, {
                SEND_MESSAGES: false,
                VIEW_CHANNEL: false,
            })

            await interaction.reply({ content: `Votre ticket a été créé avec succès \n dans le salon ${channel} !`, ephemeral: true })

            let newticket3 = new Discord.MessageEmbed()
                .setColor(config.color)
                .setTitle("📝 - Report")
                .setDescription(`Report de ${interaction.user.tag}`)
                .addField(`Moyens de payements disponibles`, `Paypal, Virement Banquaire`)
                .addField(`ID User`, `${interaction.user.id}`)
                .addField(`Date de compte`, `${moment(interaction.user.createdAt).format('[Le] DD/MM/YYYY [à] HH:mm:ss')}`)
                .addField(`Rejoint le`, `${moment(interaction.joinedAt).format('[Le] DD/MM/YYYY [à] HH:mm:ss')}`)
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp()

            const btn = new Discord.MessageActionRow().addComponents(new Discord.MessageButton()
                .setStyle("DANGER")
                .setEmoji("🔒")
                .setLabel("Fermer le ticket")
                .setCustomId("close3"),
                new Discord.MessageButton()
                .setStyle("PRIMARY")
                .setEmoji("📎")
                .setLabel("Demander le transcript")
                .setCustomId("transcript3"))

            await channel.send({ embeds: [newticket3], components: [btn] })
        }
    }

    if (interaction.isButton()) {
        var tr = Client.channels.cache.find(m => m.name == "📦ㅐlogs-tickets") // il arrive pas à trouver le channel :D, Mais l'ID Marche
        if (interaction.customId === "transcript3") {
            await interaction.deferReply()
            tr.send({ content: `Transcript de ${interaction.message.embeds[0].description.split(" ")[0]}`, files: [await transcript.createTranscript(interaction.channel)] })
            await interaction.editReply("Transcript envoyé avec succès!")
        }

        if (interaction.customId === "close3") {
            interaction.channel.delete()
        }
    }
})

//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\

// Ticket Pub
Client.on("interactionCreate", async interaction => {
    if (interaction.isSelectMenu()) {
        if (interaction.values == "pub") {

            var name = interaction.user.username
            var channel = await interaction.guild.channels.create(`pub-${name}`, { type: "GUILD_TEXT" })
            await channel.setParent(interaction.channel.parentId)

            await channel.permissionOverwrites.create(interaction.user, {
                SEND_MESSAGES: true,
                EMBED_LINKS: true,
                VIEW_CHANNEL: true,
                READ_MESSAGE_HISTORY: true,
            })
            await channel.permissionOverwrites.create(interaction.guild.roles.everyone, {
                SEND_MESSAGES: false,
                VIEW_CHANNEL: false,
            })

            await interaction.reply({ content: `Votre ticket a été créé avec succès \n dans le salon ${channel} !`, ephemeral: true })

            let newticket4 = new Discord.MessageEmbed()
                .setColor(config.color)
                .setTitle("💼 - Pubs/Partenariats")
                .setDescription(`Pub de ${interaction.user.tag}`)
                .addField(`Moyens de payements disponibles`, `Paypal, Virement Banquaire`)
                .addField(`ID User`, `${interaction.user.id}`)
                .addField(`Date de compte`, `${moment(interaction.user.createdAt).format('[Le] DD/MM/YYYY [à] HH:mm:ss')}`)
                .addField(`Rejoint le`, `${moment(interaction.joinedAt).format('[Le] DD/MM/YYYY [à] HH:mm:ss')}`)
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp()

            const btn = new Discord.MessageActionRow().addComponents(new Discord.MessageButton()
                .setStyle("DANGER")
                .setEmoji("🔒")
                .setLabel("Fermer le ticket")
                .setCustomId("close4"),
                new Discord.MessageButton()
                .setStyle("PRIMARY")
                .setEmoji("📎")
                .setLabel("Demander le transcript")
                .setCustomId("transcript4"))

            await channel.send({ embeds: [newticket4], components: [btn] })
        }
    }

    if (interaction.isButton()) {
        var tr = Client.channels.cache.find(m => m.name == "📦ㅐlogs-tickets") // il arrive pas à trouver le channel :D, Mais l'ID Marche
        if (interaction.customId === "transcript4") {
            await interaction.deferReply()
            tr.send({ content: `Transcript de ${interaction.message.embeds[0].description.split(" ")[0]}`, files: [await transcript.createTranscript(interaction.channel)] })
            await interaction.editReply("Transcript envoyé avec succès!")
        }

        if (interaction.customId === "close4") {
            interaction.channel.delete()
        }
    }
})

//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\









































//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\

// bouton
Client.on("messageCreate", message => {
    if (message.content === "bouton") {
        var row = new Discord.MessageActionRow()
            .addComponents(new Discord.MessageButton()
                .setCustomId("bouton1")
                .setLabel("Test")
                .setStyle("DANGER")
                .setEmoji("🧪")
            ).addComponents(new Discord.MessageButton()
                .setLabel("Site LunariumFR")
                .setStyle("LINK")
                .setEmoji("🌐")
                .setURL("https://lunarium-pvp.fr")
            );

        message.channel.send({
            content: "test",
            components: [row]
        });
    }
});

Client.on("interactionCreate", interaction => {
    if (interaction.isButton()) {
        if (interaction.customId === "bouton1") {
            interaction.reply("Vous avez appuyé!");
        }
    }
});

//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\
//-----------------------------------------------------------------------\\
