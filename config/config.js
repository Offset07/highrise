// Ceci est un module
module.exports = {
  // ceci est un object
  settings: {
    prefix: '/', // Le prefix pour les commande example, !help
    botName: 'BOTO_OFF', // Sa doit etre le meme nom que celui du jeu
    owerName: 'daniel_offset', // Mettez le nom du owner (créateur)
    ownerId: 'daniel_offset', // Mettez le ID du créateur 
    botId: '', // Mettez le ID du bot vous pouvez l'obtenir au 1er lancement 
    developers: ['daniel_offset'], // rajouter en autant que vous voulez
    moderators: ['daniel_offset', 'change-moi'], // rajouter en autant que vous voulez
    roomName: 'BESTIE', // Mettez le nom de la room
    // Mettez les coordonnées du bot au lancement 
    coordinates: {
      x:  8.50,
      y:  1.00,
      z:  1.50,
      facing: 'FrontLeft'
    },
    reactionName: 'wink' // La reaction du bot quand quelqu'un tips, 'wink', 'wave, 'heart', 'clap', 'thumbsup'
  },
  // cela contient des data d'authentification 
  authentication: {
    room: "64e99ff81188da64f8889bfa", // le ID de la room trouvable sur highrise.game/room/
    token: "01b50864d754b0b8522967751d2b34d252b2e8bcc065ef7327b70dfb9d14aaa6" // Le token du bot trouvable sur  https://highrise.game
  }
}
