const { Client, Intents, MessageEmbed, Permissions, CommandInteraction, ReactionUserManager  } = require("discord.js")
const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.DIRECT_MESSAGE_TYPING,Intents.FLAGS.GUILD_MEMBERS,Intents.FLAGS.GUILD_PRESENCES,Intents.FLAGS.GUILD_MESSAGES] });
const botconfig = require("./botconfig.json")
const money = require("./money.json")
var weather = require('weather-js');
const ms = require("ms");
const superagent = require('superagent');
const randomPuppy = require('random-puppy');
const fs = require("fs");
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

const welcomeChannelId = "730430575046819914"

client.on("guildMemberAdd", async (member) => {
    member.guild.channels.cache.get(welcomeChannelId).send({
        content: `<@${member.id}> Üdvözlünk a Rolix Fan Klub szerveren!`,
    })
});

client.on("guildMemberRemove", async (member) => {
    member.guild.channels.cache.get(welcomeChannelId).send({
        content: `<@${member.user.tag}> Kilépett a szerverről!`,
    })
}); 

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

         
        message.channel.send(`Sikeresen hozzáadtál <@${pay_user.id}> számlájára ${pay_money}FT-ot!`)
           

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
        if(isNaN(pay_money)) return message.reply(`A parancs helyes használata: ${prefix}ftvon <összeg> <@név>`)
        
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

         
        message.channel.send(`Sikeresen levontál <@${pay_user.id}> számlájáról ${pay_money}FT-ot!`)
           


        fs.writeFile("./money.json", JSON.stringify(money), (err) => {
            if(err) console.log(err);
        });
    } else {
        message.reply(`A parancs helyes használata: ${prefix}ftvon <összeg> <@név>`)
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

        message.member.roles.add(viprang_id)
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




if(message.content.includes("https://" || "http://"
)) {
if (message.member.permissions.has('KICK_MEMBERS')) return message.channel.send(`> __Nincs megfelelő engedélyed a parancs használatához!__`);
message.delete();
const embed = new MessageEmbed()
.setTitle('Link észlelve!')
.setDescription(`${message.author.tag} ne használj linkeket!`)
message.channel.send({ embeds: [embed] })
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
.setDescription(`Üdv én vagyok Redstone bot\n **Készítő:** *Ádám#9999* \n **Parancsaim:** http://redstone.hupont.hu/ \n **Folyamatosan fejlődök. Hamarosan jön az economy update aminsok jó dolgok tartalmaz** \n Meghívás: https://bit.ly/redstonebot`)
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

    
    

 




    if ((message.content.startsWith(`${prefix}giveaway`))) { // this condition can be changed to any command you'd like, e.g. `${prefix}gstart`
          if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(`> __Nincs megfelelő engedélyed a parancs használatához!__`); { 
       let duration = args[1];
       let winnerCount = args[2];

        if (!duration) 
           return  message.channel.send("Kérlek adj meg egy időt \nEzek elérhetőek: d (nap), h (óra), m (perc), s (másodperc) \n **Megjegyzés: 12 s csak így tudod használni!");
        if (
            !args[1].endsWith("d") &&
            !args[1].endsWith("h") &&
            !args[1].endsWith("m") &&
            !args[1].endsWith("s") 
        )
            return message.channel.send("Kérlek adj meg egy időt \nEzek elérhetőek: d (nap), h (óra), m (perc), s (másodperc) \n **Megjegyzés: 12 s csak így tudod használni!");
 

        if (!winnerCount) return message.channel.send("Kérlek add meg a nyertesek számát Pl:  1w")

        if (isNaN(args[2].toString().slice(0, -1)) || !args[2].endsWith("w")) // if args[2]/winnerCount is not a number (even after removing end 'w') or args[2] does not end with 'w', condition returns:
            return message.channel.send("Kérlek add meg a nyertesek számat. pl: 1w");
                if ((args[2].toString().slice(0, -1)) <= 0)   
                    return message.channel.send("A nyertesek száma nem lehet nagyobb 1-nél ");

            let giveawayChannel = message.mentions.channels.first();
            if (!giveawayChannel || !args[3]) return message.channel.send("Kérlek adj meg egy valós csatornát! Ha netán létezik adj hozzáférést")

            let prize = args.slice(4).join(" ");
            if (!prize) return message.channel.send('Adj meg egy nyeremént is!');

            let startGiveawayEmbed = new MessageEmbed()
                .setTitle("🎉 Nyereményjáték 🎉")
                .setDescription(`Nyeremény: ${prize}\n\n Reagálj a 🎉 emojival hogy jelentkezz a játékra!\nNyertesek: **${winnerCount.toString().slice(0, -1)}**\nIdő: **${duration}**\nIndította: **${message.author}**`)
                .setColor('RED')
                .setTimestamp(Date.now() + ms(args[1])) 
                .setFooter("Giveaway ends"); 

            let embedGiveawayHandle = await giveawayChannel.send({embeds: [startGiveawayEmbed]})
            embedGiveawayHandle.react("🎉").catch(console.error); 

            setTimeout(() => {
                if (embedGiveawayHandle.reactions.cache.get("🎉").count <= 1) {
                    return giveawayChannel.send("Senki nem jelentkezett a játékra :(")
                }
                if (embedGiveawayHandle.reactions.cache.get("🎉").count <= winnerCount.toString().slice(0, -1)) { // this if-statement can be removed
                    return giveawayChannel.send("Nem reagált elég ember !")
                }

                let winner = embedGiveawayHandle.reactions.cache.get("🎉").users.cache.filter((users) => !users.bot).random(winnerCount.toString().slice(0, -1)); 

                const endedEmbedGiveaway = new MessageEmbed()
                .setTitle("🎉 Nyereményjáték 🎉")
                .setDescription(`Nyerény${prize}\n\nNyertes(sek): ${winner}\nIndította: **${message.author}**\nNyertes: **${winnerCount.toString().slice(0, -1)}**\nRésztvevők: **${embedGiveawayHandle.reactions.cache.get("🎉").count - 1}**\nIdő: **${duration}**`)
                .setColor('RED')
                .setTimestamp(Date.now() + ms(args[1]))  
                .setFooter("Nyereményjáték vége"); 

                embedGiveawayHandle.edit({embeds:[endedEmbedGiveaway]}); 
                const congratsEmbedGiveaway = new MessageEmbed()
                .setDescription(`🥳 Gratulálok ${winner}! Nyertél! Nyereményed **${prize}**!`)
                .setColor('RED')

                giveawayChannel.send({embeds: [congratsEmbedGiveaway]}).catch(console.error); 
            }, ms(args[1]));

        } 
    }



if(cmd === `${prefix}calc`){

    var plus = Math.floor(Number(args[0]) + Number(args[2]));
    if (isNaN(plus)) return message.channel.send("``Hiba: Kérlek adj meg számokat!``");

    var minus = Math.floor(args[0]) - (args[2]);
    if (isNaN(minus)) return message.channel.send("``Hiba: Kérlek adj meg számokat!``");

    var multiply = Math.floor(args[0]) * (args[2]);
    if (isNaN(multiply)) message.channel.send("``Hiba: Kérlek adj meg számokat!``");

    var divide = Math.floor(args[0]) / (args[2]);
    if (isNaN(divide)) return message.channel.send("``Hiba: Kérlek adj meg számokat!``");

    if (args[1] ==  "+") return message.channel.send(args[0] + " + " + args[2] + " = **" + plus + "**");
    if (args[1] ==  "-") return message.channel.send(args[0] + " - " + args[2] + " = **" + minus + "**");
    if (args[1] ==  "*") return message.channel.send(args[0] + " * " + args[2] + " = **" + multiply + "**");
    if (args[1] ==  "x") return message.channel.send(args[0] + " x " + args[2] + " = **" + multiply + "**");
    if (args[1] ==  "/") return message.channel.send(args[0] + " / " + args[2] + " = **" + divide + "**");

    else {
        message.channel.send("``valami hiba van!``");
    } 
} 

        
    ///////////////////////BANxKICK///////////////////////

    

  if(cmd === `${prefix}tempban`) {
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let rawreason = args[2];
        let bantime = args[1];
        let reason = args.slice(2).join(' ')
        if (!message.member.permissions.has('BAN_MEMBERS')) return message.channel.send(`> __Nincs megfelelő engedélyed a parancs használatához!__`);
        if(!args[0] || !args[1] || !args[2] || isNaN(bantime)) return message.reply("HIBA! **Helyes használat: {prefix}ban <@felhasználó> [idő{(nap) max 7} <indok>**");
        if(user.ban({days: bantime, reason: reason})) {
     let BanEmbed = new MessageEmbed()
          .setTitle("Ban")
          .setColor("RANDOM")
          .setDescription(`**${user.user.tag}\n**Bannolva | Bannolta: ** ${message.author.tag}\n**  Ban indoka: **${args.slice(2).join(' ')}\n**  Ban időtartama: **${args[1]}**`)
          .setFooter(`Redstone Bot Bannolás`)
            message.channel.send({ embeds: [BanEmbed]})
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



client.on("messageCreate", async m => {
    if (m.author.bot) return;
    if (m.content.toLowerCase().startsWith("?device")) {
        const fullText = m.content.split(" ").slice(1).join(" ").toLowerCase();
        const member = m.mentions.members.first() || m.guild.members.cache.get(fullText) || m.guild.members.cache.find(m => m.user.username.toLowerCase() === fullText || m.displayName.toLowerCase() === fullText) || m.member;
        const cStatus = member.presence?member.presence.clientStatus:null;
        if (!cStatus) return m.channel.send("Keresett tag nem elérhető.");

        const statusMap = { 'online': 'Elérhető', 'idle': 'Nincs eszköznél', 'dnd': 'Ne zavarj', 'offline': 'Nem elérhető' };
        const statusOutput = `Weben: ${cStatus.web ? statusMap[cStatus.web] : "**X**"}
Telefonon: ${cStatus.mobile ? statusMap[cStatus.mobile] : "**X**"}
Asztali gépen: ${cStatus.desktop ? statusMap[cStatus.desktop] : "**X**"}`;

        const embed = new MessageEmbed();
        embed.setAuthor({ name: member.displayName, iconURL: member.user.avatarURL() });
        embed.setDescription(statusOutput);
        embed.setColor(0x2D6456);
        embed.setFooter({ text: `Lekérve ${m.member.displayName} által.`, iconURL: m.author.avatarURL() });
        embed.setTimestamp();
        m.channel.send({ embeds: [embed] })
    };
});
client.login("CHANGEME").then(() => console.log("Logged in.")).catch(console.error); 
 
const xpfile = require(`./xp.json`)

    client.on("message", function(message){
        if(message.author.bot) return;
        let addXP = Math.floor(Math.random() * 8) + 3;

        if(!xpfile[message.author.id]){
            xpfile[message.author.id] = {
                xp: 0,
                level: 1,
                regxp: 100
            }

            fs.writeFileSync(`./xp.json`,JSON.stringify(xpfile),function(err){
                if(err) console.log(err)
            })
        }

        xpfile[message.author.id].xp += addXP

        if(xpfile[message.author.id].xp > xpfile[message.author.id].regxp){
            xpfile[message.author.id].xp -= xpfile[message.author.id].regxp 
            xpfile[message.author.id].regxp *=1.25
            xpfile[message.author.id].regxp = Math.floor(xpfile[message.author.id].regxp)
            xpfile[message.author.id].level += 1

            message.reply(`Gratulálok elérted ezt a szintet: **${xpfile[message.author.id].level}** 👌 🎉`)
        }

        fs.writeFileSync(`./xp.json`,JSON.stringify(xpfile),function(err){
            if(err) console.log(err)
        })
    }); 








  


  




client.login(process.env.TOKEN)
