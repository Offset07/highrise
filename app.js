const { Highrise } = require("highrise-js-sdk");
const { settings, authentication } = require("./config/config");

const bot = new Highrise(authentication.token, authentication.room);
const { generatePlayersLength,
       getUptime,
       getRandomEmote,
       getRandomWelcomeMessage
      } = require("./utils/utils");

// Event emitted when the bot has successfully connected to the chat server.
bot.on('ready', async (client) => {
  console.log(`${settings.botName}(${client}) es maintenant connecté dans ${settings.roomName} avec ${await generatePlayersLength(bot)} joueurs.`);
  bot.player.teleport(client, settings.coordinates.x,
    settings.coordinates.y, settings.coordinates.z,
    settings.coordinates.facing);
});

// Event quand un message est envoyé.
bot.on('chatMessageCreate', async (user, message) => {
  console.log(`(chat): [${user.username}]: ${message}`);
  const prefix = settings.prefix;
//commande pour kick quelqu'un
  if (message.startsWith(`${prefix}kick`)) {
    if (settings.moderators.includes(user.id)) {
      const args = message.split(' ');
      if (!args || args.length < 1) {
        return bot.message.send(`Je ne comprend pas ce que vous me dites.\nExample: !kick @user`);
      }
      const userName = args[1];
      if (!userName) return bot.message.send(`pseudo incorrecte.\nExample: !kick @user`);
      const target = userName.replace('@', '');
      const userId =
        await bot.room.players.getId(target)
      try {
        if (!userId || userId.length === 0) {
          return bot.message.send(` ${target} n'est pas la`);
        } else {
          await bot.player.kick(userId[0]);
          bot.message.send(`@${target} c'est fait kick par${user.username}`)
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      return bot.message.send(`vous n'avez pas la permission de faire cela.`)
    }
  }
// come pour que le bot vous suive
    if (message.startsWith(`${prefix}come`) && settings.moderators.includes(user.id)) {
    try {
      // get your current position using cache
      const myPosition = await bot.room.players.cache.position(user.id)
      console.log(`${myPosition.x} ${myPosition.y} ${myPosition.z} ${myPosition.facing}`)
      // check if the player's position is valid if not return 
      if ('daniel_offset' in myPosition) {
        return bot.whisper.send(user.id, `Vous ne pouvez pas me faire apparaître sur une entité.`);
      }
      // move the bot to your current position
      bot.player.teleport(settings.botId, myPosition.x, myPosition.y, myPosition.z, myPosition.facing);

    } catch (error) {
      // catch the errors if any occured 
      bot.whisper.send(user.id,` qulque chose c'est mal passée contacter @bun_maha ou @iHsein`)
      console.error(error)
    }
  }
//permet au bot de réagir a des messages vous pouvez ajouter des réactions en consultant Examples.js)
  if (message.startsWith(`Coucou`)) {
    bot.message.send(`Salut ${user.username}`);
    await bot.player.emote(user.id, `emote-hello`);
  };
  if (message.startsWith(`edit le message`)) {
   bot.message.send(`edit la réponse`);
  };
//savoir depuis combien de temps le bot est la '${prefix}uptime'
  if (message.startsWith(`${prefix}uptime`)) {
    bot.message.send(await getUptime());
  };
//avoir le ping du bot '${prefix}ping'
  if (message.startsWith(`${prefix}ping`)) {
    const latency = await bot.ping.get()
    bot.message.send(`🤖 Ma latence actuelle est: ${latency}ms`)
  }
  // "commande pour faire marcher une emote sur 1 seul personne " marche en disant '${prefix}nom de lemote' pour ajouter des emotes, consulte emotes.json pour avoir les ID
  const emotes = {
    '!russian': 'dance-russian',
    '!shop': 'dance-shoppingcart',
    '!sing': 'idle_singing',
    '!float': 'emote-float',
    '!teleport': 'emote-teleporting',
    '!snow': 'emote-snowangel',
    '!tiktok10': 'dance-tiktok10',
    '!tiktok2': 'dance-tiktok2',
    '!blackpink': 'dance-blackpink',
    '!rest': 'sit-idle-cute',
    '!enthusiast': 'idle-enthusiastic',
    '!bow': 'emote-bow',
    '!nom de emote': 'emote-id'
}
  if (message.toLowerCase() in emotes) {

    bot.player.emote(user.id, emotes[message.toLowerCase()]);
  };
// emote random 
 if (message.startsWith(`${prefix}emote`)) {
    if (settings.moderators.includes(user.id)) {
      const players = await bot.room.players.fetch();
      const randomEmote = await getRandomEmote();
      players.forEach(async (player) => {
        const playerId = player[0].id;
        await bot.player.emote(playerId, randomEmote);
      });
    } else {
      bot.message.send(`${user.username} Tu n'as pas les permissions`)
    }
  }
});

// Event quand un message privé est créé.
bot.on('whisperMessageCreate', (user, message) => {
  console.log(`(whisper)[${user.username}]: ${message}`);
// "fait parler le bot en salle en lui chuchotant" marche en chuchotant le bot '${prefix}ton message'
  const prefix = settings.prefix;
  if (message.startsWith(prefix)) {
    const text = message.split(prefix)[1].trim();
    bot.message.send(text);
  }
});

// Event quand quelquen fait une emote / envoie une réaction
bot.on('emoteCreate', (sender, receiver, emote) => {
  console.log(`[emoteCreate]: ${sender.username} a envoyé ${emote} a ${receiver.username}`);
});

// Event quand quelqu'un es banni ou reçois qlq chose
bot.on('reactionCreate', async (sender, receiver, reaction) => {
  console.log(`[reactionCreate]: ${sender.username} a envoyé ${reaction} a ${receiver.username}`);
  if (settings.moderators.includes(sender.id) && reaction === settings.reactionName) {
    if (!settings.moderators.includes(receiver.id)) {
      bot.whisper.send(receiver.id, `Ta été kick de la room, @${sender.username} ta kick`);
      await bot.player.kick(receiver.id);
    } else {
      bot.message.send(`La personne que vous essayé de kick es modérateur(rice)`)
    }
  }
});

// Event quand quelqu'un tips
bot.on('tipReactionCreate', (sender, receiver, item) => {
  console.log(`[tipReactionCreate]: reaction de tip de ${sender.username} a ${receiver.username}: ${item.amount} ${item.type}`);
  bot.message.send(`@${sender.username} a donné a @${receiver.username} ${item.amount} ${item.type} merci a lui`);
});

// Event quand quelquen rejoins la room pour rajouter + de messages de bienvenue consulte utils.js
bot.on('playerJoin', async (user) => {
  console.log(`[playerJoin]: ${user.username}(${user.id}) a rejoint `);

  if (user.username === 'daniel_offset') {
    bot.message.send("mon createur a rejoins")
  }

  const randomMessage = await getRandomWelcomeMessage()
  bot.message.send(randomMessage.replace('{{user}}', user.username))
});

// Event quand quelqu'un quitte la room.
bot.on('playerLeave', (user) => {
  console.log(`[playerLeave]: ${user.username}(${user.id}) a quitté`);
  bot.message.send(`@${user.username} a quitté `)
});

// Event quand quelqu'un change de position 
bot.on('TrackPlayerMovement', (position) => {
  if ('x' in position && 'y' in position && 'z' in position && 'facing' in position) {
    console.log(`[TrackPlayerMovement]: ${user.username} moved to ${position.x}, ${position.y}, ${position.z}, ${position.facing}`);
  } else if ('entity_id' in position && 'anchor_ix' in position) {
    console.log(`[TrackPlayerMovement]: ${user.username} moved to anchor ${position.entity_id} at index ${position.anchor_ix}`);
  }
});