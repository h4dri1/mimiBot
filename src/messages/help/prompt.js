module.exports = {
  hello: "" +
    "Bonjour je suis mimiBot, je suis là pour vous aider à trouver et télécharger des torrents.\n" +
    "Une fois téléchargé vous pourrez le visonner sur Plex.\n\n" +
    "Pour trouver un torrent, il vous suffit de me demander de trouver un film ou une série.\n\n" +
    "Par exemple:\n" +
    "'!mimi trouve Interstellar'\n\n" +
    "D'autres commandes sont disponible vous pouvez avoir plus d'informations en tapant '!mimi help torrents'.\n",

  help: "" +
    "!mimi hello [user] -> Dit bonjour.\n" +
    "!mimi help -> Ce menu\n" +
    "!mimi help torrents -> Menu help torrents\n",

  helpTorrents: "" +
    "Je peux vous aider à trouver et télécharger des torrents.\n" +
    "Une fois téléchargé vous pourrez le visonner sur Plex.\n\n" +
    "Pour trouver un torrent, il vous suffit de me demander de trouver un film ou une série.\n\n" +
    "Par exemple:\n" +
    "'!mimi trouve Interstellar'\n\n" +
    "En me le demandant de cette manière je vais vous poser plusieurs questions pour trouver le torrent le plus adapté à vos critères.\n" +
    "Si vous souhaitez que je trouve un torrent sans vous poser de questions, vous pouvez me donner les informations suivantes:\n\n" +
    " -Pour chercher un film et préciser l'année de sortie:\n" +
    " '!mimi trouve Interstellar -y 2014'\n\n" +
    " -Pour chercher une série et préciser la saison:\n" + 
    " '!mimi trouve Game of Thrones -e S01'\n\n" +
    " -Pour chercher une série et préciser la saison et l'épisode:\n" + 
    " '!mimi trouve Game of Thrones -e S01E01'\n\n" +
    "Vous pouvez aussi préciser la qualité du torrent que vous souhaitez trouver en ajoutant -q 1, -q 2, -q 3 ou -q 4.\n\n" +
    "Par exemple:\n" + 
    " '!mimi trouve Interstellar -y 2014 -q 1'\n\n" +
    " -La qualité 1 correspond à une TV 4K et une exellente connexion internet est nécessaire pour le visionner.\n" +
    " -La qualité 2 correspond à une TV HD et une bonne connexion internet est nécessaire pour le visionner.\n" +
    " -La qualité 3 correspond à une TV 4K et une connexion internet moyenne est nécessaire pour le visionner.\n" +
    " -La qualité 4 correspond à une TV HD et une connexion internet moyenne est nécessaire pour le visionner.\n\n" +
    "Une fois le torrent trouvé, je vais le télécharger et vous prévenir quand il sera prêt à être visionné.\n"
  
}