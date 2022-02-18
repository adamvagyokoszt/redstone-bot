const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: "channelinfo",
        aliases: ['ci', 'channeli', 'cinfo'],
        category: " 📰 | Információs Parancsok",
        description: "Szoba információ",
        usage: "[ Szoba említés | Szoba név | ID] (választható)",
        accessableby: "everyone"
    },
    run: async (bot, message, args) => {
        let channel = message.mentions.channels.first() || bot.guilds.cache.get(message.guild.id).channels.cache.get(args[0]) || message.guild.channels.cache.find(r => r.name.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.channel;
        if (!channel) return message.channel.send("**Ilyen szoba nem létezik!**");

        let channelembed = new MessageEmbed()
            .setTitle(`Csatorna információ ennek a csatornának${channel.name}`)
            .setThumbnail(message.guild.iconURL())
            .addField("**NSFW**", channel.nsfw, true)
            .addField("**Csatorna ID**", channel.id, true)
            .addField("**Csatorna típus**", channel.type)
            .addField("**Csatorna Leírás**", `${channel.topic || "Nincs leírás"}`)
            .addField("**Csatorna készítve ekkor**", channel.createdAt)
            .setColor("GREEN")
        message.channel.send(channelembed);
    } 
