const Discord = require("discord.js");
const botconfig = require("./botconfig.json");
const bot = new Discord.Client({disableEveryone: true});
const fs = require("fs");
const money = require("./money.json")
var weather = require('weather-js');
const ms = require("ms");

let botname = "Redstone Bot"

bot.on("ready", async() => {
    console.log(`${bot.user.username} sikeresn elindult!`)

    let státuszok = [
        `${bot.guilds.cache.size}  szerver`,
        "Prefix: ?",
        "?help",
        "Fejlesztő: Ádám"
    ]

    setInterval(function() {
        let status = státuszok[Math.floor(Math.random()* státuszok.length)]

        bot.user.setActivity(status, {type: "WATCHING"})
    }, 5000)
})


bot.on("message", async message => {
    let MessageArray = message.content.split(" ");
    let cmd = MessageArray[0];
    let args = MessageArray.slice(1);
    let prefix = botconfig.prefix;

    if(!money[message.author.id]){
        money[message.author.id] = {
            money: 200

        };
    }
    fs.writeFile("./money.json", JSON.stringify(money), (err) => {
        if(err) console.log(err);
    });
    let selfMoney = money[message.author.id].money;

    if(cmd === `${prefix}egyenleg`){
        let profilkep = message.author.displayAvatarURL();

        let MoneyEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.username)

        .setColor("GREEN")

        .addField("Egyenleged:", `${selfMoney}FT`)

        .setThumbnail(profilkep)

        .setFooter(`${botname} | ${message.createdAt} | ${bot.users.cache.size}.Tag`)

        message.channel.send(MoneyEmbed)
    }

    if(cmd === `${prefix}1ft`){
        message.channel.send("1FT ot kaptál!")
        money[message.author.id] = {
            money: selfMoney + 1
        }
    }
 if(cmd === `${prefix}help`){
      message.channel.send("Parancsok még feljesztés alatt álnak egyenlőre moderációs parancsok vannak") 
    }
    
    if(cmd === `${prefix}weather`){
        if(args[0]){
            weather.find({search: args.join(" "), degreeType: "C"}, function(err, result) {
                if (err) message.reply(err);

                if(result.length === 0){
                    message.reply("Kérlek adj meg egy létező település nevet!")
                    return;
                }

                let current = result[0].current;
                let location = result[0].location;

                let WeatherEmbed = new Discord.MessageEmbed()
                .setDescription(`**${current.skytext}**`)
                .setAuthor(`Időjárás itt: ${current.observationpoint}`)
                .setThumbnail(current.imageUrl)
                .setColor("GREEN")
                .addField("Időzóna:", `UTC${location.timezone}`, true)
                .addField("Fokozat típusa:", `${location.degreetype}`, true)
                .addField("Hőfok", `${current.temperature}°C`, true)
                .addField("Hőérzet:", `${current.feelslike}°C`, true)
                .addField("Szél", `${current.winddisplay}`, true)
                .addField("Páratartalom:", `${current.humidity}%`, true)

                message.channel.send(WeatherEmbed);
            })

        } else {
            message.reply("Kérlek adj meg egy település nevet!")
        }
    }

    
    if(cmd === `${prefix}botping`) {
        message. channel. send("Pinging..."). then(m =>{
        var ping = m. createdTimestamp - message. createdTimestamp;
        var botPing = Math. round(bot. pi);
        m.edit(`ÁdámBot pingje:\n ${ping}ms`);
        });
      }

      

    if(cmd === `${prefix}say`){
        let szöveg = args.join(" ");
        if(szöveg) {
            let Embed = new Discord.MessageEmbed()
        .setColor("GREEN")

        .setAuthor(message.author.username)

        .addField("Szöveg:", szöveg)

        .setFooter(`${botname} | ${message.createdAt}`)
    
        message.channel.send(Embed)
        } else {
            message.reply("írj say szöveget!")
        }
    }

    
    if(cmd === `${prefix}ötlet`){
        let szöveg = args.join(" ");

        if(szöveg) {
            let Embed = new Discord.MessageEmbed()
        .setColor("GREEN")

        .setAuthor(message.author.username + `|Ötletett köldött🧱`)

        .addField("Szöveg:", szöveg)

        .setFooter(`${botname} | ${message.createdAt}`)
    
        message.channel.send(Embed)
        } else {
            message.reply("írj ötletet !")
        }
    }

 

    if (cmd === `${prefix}clear`) {
        if (message.member.permissions.has('KICK_MEMBERS')) {
            if(message.guild.member(bot.user).hasPermission("ADMINISTRATOR"))

            if (args[0] && isNaN(args[0]) && args[0] <= 100 || 0 < args[0] && args[0] < 101) {

                

                let clearEmbed = new Discord.MessageEmbed()
                .setTitle(`Törölve lett ${Math.round(args[0])} Üzenet a szobából! 🧹`)
                .setColor("GREEN")
                .setAuthor(message.author.username)
                .setTimestamp()

                message.channel.send(clearEmbed);


                message.channel.bulkDelete(Math.round(args[0]))


            }
        }
    }
    
    ///////////////////////BANxKICK///////////////////////

    if(cmd === `${prefix}ban`) {
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let rawreason = args[2];
        let reason = args.slice(2).join(' ')
        if (!message.member.hasPermission("BAN_MEMBERS")) return message.reply("HIBA! **Nincs jogod ehhez a parancshoz! Szükséges jog:** `Tagok kitiltása!`")
        if(!args[0] || !args[1] || !args[2] ) return message.reply("HIBA! **Helyes használat: ?ban <@felhasználó> <indok>**");
        if (user.hasPermission("BAN_MEMBERS") || user.hasPermission("ADMINISTRATOR")) return message.reply("HIBA! **Magaddal egyen rangú tagot, vagy nagyobbat nem bannolhatsz ki!**");
        if(user.ban({reason: reason})) {
            message.reply("**Sikeresen kitiltottad a következő felhasználót:** (" + user.user.tag + ")")
        } else {
            message.reply("HIBA! **Nincs jogom bannolni ezt az embert.**");
        }
    }

    if(cmd === `${prefix}kick`){
        if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("HIBA! **Nincs jogod ehhez a parancshoz! Szükséges jog:** `Tagok kirúgása!`")
        let kick_user = message.mentions.members.first();
        if(args[0] && kick_user){

            if(args[1]){

                let KickEmbed = new Discord.MessageEmbed()
                .setTitle("KICK")
                .setColor("GREEN")
                .setDescription(`**Kickelte:** ${message.author.tag}\n**Kickelve lett:** ${kick_user.user.tag}\n**Kick indoka:** ${args.slice(1).join(" ")}`)

            message.channel.send(KickEmbed);

                kick_user.kick(args.slice(1).join(" "));

            } else {
            let parancsEmbed = new Discord.MessageEmbed()
            .setTitle("Parancs használata:")
            .addField(`\`${prefix}kick <@név> [indok]\``, "DreamBot")
            .setColor("GREEN")
            .setDescription("HIBA: Kérlek adj meg egy indokot!!")

            message.channel.send(parancsEmbed);
            }

        } else {
            let parancsEmbed = new Discord.MessageEmbed()
            .setTitle("Parancs használata:")
            .addField(`\`${prefix}kick <@név> [indok]\``, "RedstoneBot")
            .setColor("GREEN")
            .setDescription("HIBA: Kérlek említs meg egy embert!")

            message.channel.send(parancsEmbed);

        }
    }
})
bot.login(process.env.TOKEN)
