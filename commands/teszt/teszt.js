const { Client, Intents, MessageEmbed, Permissions, CommandInteraction, ReactionUserManager, MessageActionRow, MessageButton, Collection } = require("discord.js")
const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.DIRECT_MESSAGE_TYPING,Intents.FLAGS.GUILD_MEMBERS,Intents.FLAGS.GUILD_PRESENCES,Intents.FLAGS.GUILD_MESSAGES] });
module.exports = {
    name: "teszt",
    category: "teszt kategória",
    description: "teszt command",
    run: async (client, message, args) => {
          message.channel.send("Parancs működik")
    }

}
