//ajouter un message custom
if (message.startsWith(`edit le message`)) {
   bot.message.send(`edit la réponse`);
  };
//pour faire bouger la personne quand elle dit un mot spécial emotes.json
await bot.player.emote(user.id, `emote-id`);