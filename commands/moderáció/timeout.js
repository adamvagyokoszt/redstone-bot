module.exports = {
    name: "timeout",
    aliases: ["to"],
    permissions: ["MANAGE_MESSAGES"],
    description: "Timeout command.",
    async execute(message, args, cmd, client, Discord) {
      
        if(args.length < 2){
            return message.reply(" legalább 2 paramétert adj meg! (felhasználó + idő + indok)");
        }
        var reason = "";
        var user = message.mentions.members.first();
        for (let index = 2; index < args.length; index++) {
            reason += args[index]+" ";
            
        }
        
        (message.mentions.members.first()).timeout(args[1]*1000, args[2]).catch(error => {return;});
        
        await message.channel.messages.fetch({
            limit: 100,
           }).then((messages) => {
            messages = messages
            .filter((msg) => msg.author.id === user.id);
            message.channel.bulkDelete(messages, true).catch(error => console.log(error.stack));
           });
        
    }
  };