const { Client, Intents, MessageEmbed, Permissions } = require("discord.js")
const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.DIRECT_MESSAGE_TYPING,Intents.FLAGS.GUILD_MEMBERS,Intents.FLAGS.GUILD_PRESENCES,Intents.FLAGS.GUILD_MESSAGES ] });
const botconfig = require("./botconfig.json")
const money = require("./money.json")
var weather = require('weather-js');
const ms = require("ms");
const superagent = require('superagent');
const randomPuppy = require('random-puppy');
const fs = require("fs");
const { MessageButton, MessageActionRow } = require('discord-buttons')
let clientname = "Redstone Bot"

client.on("ready", async() => {
    console.log(`${client.user.username} sikeresn elindult!`)

    let státuszok = [
        `${client.guilds.cache.size}  szerver`,
        "Prefix: ?",
        "?help",
        "Fejlesztő: Ádám"
    ]

    setInterval(function() {
        let status = státuszok[Math.floor(Math.random()* státuszok.length)]

        client.user.setActivity(status, {type: "WATCHING"})
    }, 5000)
})
/////) Üdvözlő rendszer/////////
client.on("guildMemberAdd", (member) => {
    const rulesChanel = member.guild.rulesChannelID;
    const channelID = "730430575046819914"

    const message = `Szia <@${member.id}>! Üdv itt a Rolix Fan klub szerveren. Szabályzat:${member.guild.channels.cache.get(rulesChanel).toString()}`

    const channel = member.guild.channels.cache.get(channelID);
    channel.send(message)
})
client.on("guildMemberRemove", (member) => {
    const channelID = "730430575046819914"


    const  message = `Viszlát <${member.user.tag}>! Remélem vissza jössz egyszer!`
    const channel = member.guild.channels.cache.get(channelID);
    channel.send(message)
}) 
/////Economy//////
client.on("message", async message => {
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

        let MoneyEmbed = new MessageEmbed()
        .setAuthor(message.author.username)

        .setColor("GREEN")

        .addField("Egyenleged:", `${selfMoney}FT`)

        .setThumbnail(profilkep)

        .setFooter(`${clientname} | ${message.createdAt}`)

        message.channel.send({ embeds: [MoneyEmbed]})
    }


        if(cmd === `${prefix}ftadd`){
        if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(`> __Nincs megfelelő engedélyed a parancs használatához!__`);
        let pay_money = Math.round(args[0]*100)/100
        if(isNaN(pay_money)) return message.reply(`A parancs helyes használata: ${prefix}ftadd <összeg> <@név>`)
        
        let pay_user = message.mentions.members.first();

        if(args[1] && pay_user){
            if(!money[pay_user.id]) {
                money[pay_user.id] = {
                    money: 100,
                    user_id: pay_user.id
                }
            }

            money[pay_user.id] = {
                money: money[pay_user.id].money + pay_money,
                user_id: pay_user.id
            }

         

        message.channel.send(`Sikeresen átutaltál <@${pay_user.id}> számlájára ${pay_money}FT-ot!`)

        fs.writeFile("./money.json", JSON.stringify(money), (err) => {
            if(err) console.log(err);
        });
    } else {
        message.reply(`A parancs helyes használata: ${prefix}ftadd <összeg> <@név>`)
    }
}

    if(cmd === `${prefix}ftvon`){
        if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(`> __Nincs megfelelő engedélyed a parancs használatához!__`);
        let pay_money = Math.round(args[0]*100)/100
        if(isNaN(pay_money)) return message.reply(`A parancs helyes használata: ${prefix}ftadd <összeg> <@név>`)
        
        let pay_user = message.mentions.members.first();

        if(args[1] && pay_user){
            if(!money[pay_user.id]) {
                money[pay_user.id] = {
                    money: 100,
                    user_id: pay_user.id
                }
            }

            money[pay_user.id] = {
                money: money[pay_user.id].money - pay_money,
                user_id: pay_user.id
            }

         

        message.channel.send(`Sikeresen levontál <@${pay_user.id}> számlájára ${pay_money}FT-ot!`)

        fs.writeFile("./money.json", JSON.stringify(money), (err) => {
            if(err) console.log(err);
        });
    } else {
        message.reply(`A parancs helyes használata: ${prefix}ftadd <összeg> <@név>`)
    }
}
        
    if(cmd === `${prefix}slot`){
        let min_money = 50;
        if(selfMoney < min_money) return message.reply(`Túl kevés pénzed van! (Minimum ${min_money}FT-nak kell lennie a számládon!) Egyenleged: ${selfMoney}.`)

        let tét = Math.round(args[0] *100)/100
        if(isNaN(tét)) return message.reply("Kérlek adj meg egy összeget! (Pl: 5)")
        if(tét > selfMoney) return message.reply("az egyenlegeednél több pénzt nem rakhatsz fel a slotra!")

        let slots = ["🍌", "🍎", "🍍", "🥒", "🍇"]
        let result1 = Math.floor(Math.random() * slots.length)
        let result2 = Math.floor(Math.random() * slots.length)
        let result3 = Math.floor(Math.random() * slots.length)

        if(slots[result1] === slots[result2] && slots[result3]){
            let wEmbed = new MessageEmbed()
            .setTitle('🎉 Szerencse játék | slot machine 🎉')
            .addField(message.author.username, `Nyertél! Ennyit kaptál: ${tét*1.6}ft.`)
            .addField("Eredmény:", slots[result1] + slots[result2] + slots[result3])
            .setColor("RANDOM")
            .setTimestamp(message.createdAt)
            .setFooter(clientname)
            message.channel.send({ embeds: [wEmbed] })
           
 money[message.author.id] = {
                money: selfMoney + tét*1.6,
                user_id: message.author.id
            }
        } else {
            let wEmbed = new MessageEmbed()
            .setTitle('🎉 Szerencse játék | slot machine 🎉')
            .addField(message.author.username, `Vesztettél! Ennyit buktál: ${tét}ft.`)
            .addField("Eredmény:", slots[result1] + slots[result2] + slots[result3])
            .setColor("RANDOM")
            .setTimestamp(message.createdAt)
            .setFooter(clientname)
            message.channel.send({ embeds: [wEmbed] })
           
            money[message.author.id] = {
                money: selfMoney - tét,
                user_id: message.author.id
            }
        }
    }

    if(cmd === `${prefix}pay`){
        let pay_money = Math.round(args[0]*100)/100
        if(isNaN(pay_money)) return message.reply(`A parancs helyes használata: ${prefix}pay <összeg> <@név>`)
        if(pay_money > selfMoney) return message.reply("az egyenlegednél több pénzt nem adhatsz meg!")

        let pay_user = message.mentions.members.first();

        if(args[1] && pay_user){
            if(!money[pay_user.id]) {
                money[pay_user.id] = {
                    money: 100,
                    user_id: pay_user.id
                }
            }

            money[pay_user.id] = {
                money: money[pay_user.id].money + pay_money,
                user_id: pay_user.id
            }

            money[message.author.id] = {
                money: selfMoney - pay_money,
                user_id: message.author.id
        }

        message.channel.send(`Sikeresen átutaltál <@${pay_user.id}> számlájára ${pay_money}FT-ot!`)

        fs.writeFile("./money.json", JSON.stringify(money), (err) => {
            if(err) console.log(err);
        });
    } else {
        message.reply(`A parancs helyes használata: ${prefix}pay <összeg> <@név>`)
    }
}

if(cmd === `${prefix}work`){
    let cd_role_id = "879320935566565438";
    let cooldown_time = "600";

    if(message.member.roles.cache.has(cd_role_id)) return message.reply(`Ezt a parancsot 10 percenként használhatod`)

    message.member.roles.add(cd_role_id)

    let üzenetek = ["Jó munkát végeztél","Feltörted a haverod gépét","Feltörted a főnököd gépét","Túl óráztál"]
    let random_üzenet_szam = Math.floor(Math.random()*üzenetek.length)

    let random_money = Math.floor(Math.random()*500 +1)

    let workEmbed = new MessageEmbed()
    .setTitle("Munka")

    .addField(`${üzenetek[random_üzenet_szam]}` , ` A számládhoz került: ${random_money} FT!`)

    .setColor("RANDOM")

    .setTimestamp(message.createdAt)

    .setFooter(clientname)

    message.channel.send({ embeds: [workEmbed] })
           


    money[message.author.id] = {
        money: selfMoney + random_money,
        user_id: message.author.id
}

setTimeout(() => {
    message.member.roles.remove(cd_role_id)
    }, 1000* cooldown_time)
}

           

    

///////SHOP//////////
if(cmd === `${prefix}shop`){
        let ShopEmbed = new MessageEmbed()
            .setAuthor(message.author.username)
            .setDescription(`${prefix}vasarol-vip (ÁR: 50000FT) | ${prefix}vasarol-vip+ (ÁR: 120000FT) | ${prefix}vasarol-gamer (ÁR: 12000FT)`)
            .setColor("RANDOM")
            .setThumbnail(client.user.displayAvatarURL())

            message.channel.send({ embeds: [ShopEmbed] })
           
    }




    if(cmd === `${prefix}vasarol-vip`){
        let viprang_id = "824215428984340490"

        let price = "50000";
        if(message.member.roles.cache.has(viprang_id)) return message.reply("*Ezt a rangot már megvetted!*");
        if(selfMoney < price) return message.reply(`Erre a rangra nincs pénzed! Egyenleged: ${selfMoney}FT.`)

        money[message.author.id] = {
            money: selfMoney - parseInt(price),
            user_id: message.author.id
        }

        message.guild.member(message.author.id).roles.add(viprang_id);

        message.reply("**Sikeres vásárlás! A rangot odaadtam a pénzt levontam**")

    }
if(cmd === `${prefix}vasarol-gamer`){
        let viprang_id = "824223658196598804"

        let price = "50000";
        if(message.member.roles.cache.has(viprang_id)) return message.reply("*Ezt a rangot már megvetted!*");
        if(selfMoney < price) return message.reply(`Erre a rangra nincs pénzed! Egyenleged: ${selfMoney}FT.`)

        money[message.author.id] = {
            money: selfMoney - parseInt(price),
            user_id: message.author.id
        }

        message.guild.member(message.author.id).roles.add(viprang_id);

        message.reply("**Sikeres vásárlás! A rangot odaadtam a pénzt levontam**")

    }

if(cmd === `${prefix}vasarol-vip+`){
        let viprang_id = "824216009744973824"

        let price = "120000";
        if(message.member.roles.cache.has(viprang_id)) return message.reply("*Ezt a rangot már megvetted!*");
        if(selfMoney < price) return message.reply(`Erre a rangra nincs pénzed! Egyenleged: ${selfMoney}FT.`)

        money[message.author.id] = {
            money: selfMoney - parseInt(price),
            user_id: message.author.id
        }

        message.guild.member(message.author.id).roles.add(viprang_id);

        message.reply("**Sikeres vásárlás! A rangot odaadtam a pénzt levontam**")
    }



if(cmd === `${prefix}szavazas`){
    if (!message.member.permissions.has('BAN_MEMBERS')) return message.channel.send(`> __Nincs megfelelő engedélyed a parancs használatához!__`);
    if(message.channel.type === 'dm') return message.reply("Itt nem tudod használni!");
    if(args[0]){
        let szavazasembed = new MessageEmbed()
        .setAuthor(message.author.tag + ` | Szavazást indított!`)
        .setDescription(args.join(" "))
        .setColor("RANDOM")
        .setTimestamp(message.createdAt)
        .setFooter(client.user.username)

        message.channel.send({ embeds: [szavazasembed] }).then(async msg => {
            await msg.react("✅")
            await msg.react("❌")
        })
    } else {
        message.reply("Kérlek add meg a szavazást!")
    }
} 





    if(cmd === `${prefix}meme`){
        if(message.channel.type === 'dm') return message.reply("Itt nem tudod használni!");
        const subreddits = ["dankmeme", "meme", "me_irl"]
        const random = subreddits[Math.floor(Math.random() * subreddits.length)]

        const IMG = await randomPuppy(random)
        const MemeEmbed = new MessageEmbed()
        .setColor("RANDOM")
        .setImage(IMG)
        .setTitle(`Keresési szöveg: ${random} (KATT IDE!)`)
        .setURL(`https://www.reddit.com/r/${random}`)

        message.channel.send({ embeds: [MemeEmbed] })
    } 



 
if(cmd === `${prefix}help`) {
const embed = new MessageEmbed() 
.setTitle('Help')
.setDescription(`Üdv én vagyok Redstone bot | **Készítő:** *Ádám#9999* | **Parancsaim:** http://redstone.hupont.hu/ | **Folyamatosan fejlődök. Hamarosan jön az economy update aminsok jó dolgok tartalmaz** `)
.setColor('RANDOM')
.setFooter('Help parancs Redstone bot')
message.channel.send({ embeds: [embed] })
            
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

                let WeatherEmbed = new MessageEmbed()
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

                message.channel.send({ embeds: [WeatherEmbed] })
            })

        } else {
            message.reply("Kérlek adj meg egy település nevet!")
        }
    }

    
    if(cmd === `${prefix}botping`) {
        message. channel. send("Pinging..."). then(m =>{
        let ping = m. createdTimestamp - message. createdTimestamp;
        let clientPing = Math. round(bot. pi);
        m.edit(` Redstone bot pingje:\n ${ping}ms`);
        });
      }

         
    



    if(cmd === `${prefix}embedsay`){
        if (!message.member.permissions.has('BAN_MEMBERS')) return message.channel.send(`> __Nincs megfelelő engedélyed a parancs használatához!__`);
        let szöveg = args.join(" ");
        if(szöveg) {
            let Embed = new MessageEmbed()
        .setColor("GREEN")

        .setAuthor(message.author.username)

        .addField("Szöveg:", szöveg)

        .setFooter(`${clientname} | ${message.createdAt}`)
    
        message.channel.send({ embeds: [Embed] })
        } else {
            message.reply("írj say szöveget!")
        }
    }

    
    

 if(cmd === `${prefix}giveaway`){
            const messageArray = message.content.split(" ");
            if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(`> __Nincs megfelelő engedélyed a parancs használatához!__`);
            let tárgy = "";
            let idő;
            let winnerCount;
 
            for (let i = 1; i < args.length; i++){
                tárgy += (args[i] + " ")
                console.log(tárgy)
            }
 
            idő = args[0];
 
        if(!idő){
            return message.reply("Kérlek adj meg egy idő intervallumot! pl: 100s, 5h, 2d")
        }
        if(!tárgy){
            return message.reply("Kérlek add meg a nyereményjáték tárgyát!")
        }
 
        var Gembed = new MessageEmbed()
        .setColor("RED")
        .setTitle("🎉 Nyereményjáték 🎉")
        .setDescription(`**${tárgy}**`)
        .addField("`Időtartam:`", ms(ms(idő), {long: true}), true)
        .setFooter("A jelentkezéshe reagálj ezzel: 🎉")
        message.channel.send({ embeds: [Gembed] }).then(async msg => {
            await msg.react("🎉")
        })
        


        setTimeout(async() => {
            try{
                const peopleReactedBOT =  await embedSent.reactions.cache.get("🎉").users.fetch();
                var peopleReacted = peopleReactedBOT.array().filter(u => u.id !== bot.user.id);
            }catch(e){
                return message.channel.send(`Hiba törtét a **${tárgy}** sorsolása során! Hiba: `+"`"+e+"`")
            }
        
            var winner;
 
            if(peopleReacted.length <= 0){
                return message.channel.send("Senki nem jelentkezett a nyereményjátékra! :C")
            } else {
                var index = Math.floor(Math.random() * peopleReacted.length);
                winner = peopleReacted[index]
            }
 
            if(!winner) {
                message.channel.send("Hiba történt a sorsolás során!")
            } else {
                message.channel.send(`🎉🎉🎉🎉 **${winner.toString()}** Gratulálok! Nyereményed: **${tárgy}** 🎉🎉🎉🎉`);
            }
        }, ms(idő))
        }


        
    ///////////////////////BANxKICK///////////////////////

    

  if(cmd === `${prefix}tempban`) {
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let rawreason = args[2];
        let bantime = args[1];
        let reason = args.slice(2).join(' ')
        if (!message.member.hasPermission("BAN_MEMBERS")) return message.reply("HIBA! **Nincs jogod ehhez a parancshoz! Szükséges jog:** `Tagok kitiltása!`")
        if(!args[0] || !args[1] || !args[2] || isNaN(bantime)) return message.reply("HIBA! **Helyes használat: {prefix}ban <@felhasználó> [idő{(nap) max 7} <indok>**");
        if (user.hasPermission("BAN_MEMBERS") || user.hasPermission("ADMINISTRATOR")) return message.reply("HIBA! **Magaddal egyen rangú tagot, vagy nagyobbat nem bannolhatsz ki!**");
        if(user.ban({days: bantime, reason: reason})) {
            message.reply("**Sikeresen kitiltottad a következő felhasználót:** (" + user.user.tag + ")")
        } else {
            message.reply("HIBA! **Nincs jogom bannolni ezt az embert.**");
        }
    }


if(cmd === `${prefix}kick`){
        if (!message.member.permissions.has('KICK_MEMBERS')) return message.channel.send(`> __Nincs megfelelő engedélyed a parancs használatához!__`);
        let kick_user = message.mentions.members.first();
        if(args[0] && kick_user){

            if(args[1]){

                let KickEmbed = new MessageEmbed()
                .setTitle("KICK")
                .setColor("GREEN")
                .setDescription(`**Kickelte:** ${message.author.tag}\n**Kickelve lett:** ${kick_user.user.tag}\n**Kick indoka:** ${args.slice(1).join(" ")}`)

            message.channel.send({ embeds: [KickEmbed] });

                kick_user.kick(args.slice(1).join(" "));

            } else {
            let kick2Embed = new MessageEmbed()
            .setTitle("Parancs használata:")
            .addField(`\`${prefix}kick <@név> [indok]\``, "RedstoneBot")
            .setColor("GREEN")
            .setDescription("HIBA: Kérlek adj meg egy indokot!!")
            message.channel.send({ embeds: [kick2Embed] });
            }

        } else {
            let kick3Embed = new MessageEmbed()
            .setTitle("Parancs használata:")
            .addField(`\`${prefix}kick <@név> [indok]\``, "RedstoneBot")
            .setColor("GREEN")
            .setDescription("HIBA: Kérlek említs meg egy embert!")

            message.channel.send({ embeds: [kick3Embed] });
        }
    }

    
    

})





  


  






client.login(process.env.TOKEN)
