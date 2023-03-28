
const ExtractMediaInfos = require('../torrents/extract')
const Interact = require('../torrents/interact')
const SendMessage = require('../services/sendMessage')
const FilterTorrents = require('../torrents/filter')

const {
  searchTorrents,
  createTorrentsArray,
  downloadTorrent
} = require('../torrents/services')

// Prepare extractMediaInfos instance
// This instance will be used to extract infos from the user's message
// And create a mediaInfos object
let mediaInfos = new ExtractMediaInfos()

const checkAndSearch = async () => {
  // Check if all the infos are here
  // Check for tv show or movie
  // Search for torrents
  if (mediaInfos.torrentType === 'tv' && mediaInfos.torrentSeason && mediaInfos.torrentQuality) {
    // Add S and E to the torrent name if user search a tv show
    const tvTorrentName = `${mediaInfos.torrentName} S${mediaInfos.torrentSeason}${mediaInfos.torrentEpisode ? 'E' + mediaInfos.torrentEpisode : '' }`
    return await searchTorrents(tvTorrentName, 2);
  } else if (mediaInfos.torrentType === 'movie' && mediaInfos.torrentQuality) {
    return await searchTorrents(mediaInfos.torrentName, 1);
  }

  return null
}

const filter = async (torrents) => {
  // Create an array of torrents with only name, size, link and year
  // Filter the torrents list
  const array = createTorrentsArray(torrents.Results, mediaInfos);
  const filteredArray = FilterTorrents.filterList(array, mediaInfos)

  if (filteredArray) {
    return filteredArray
  }

  return null
}

async function runTorrentsCommand(roomId, ev, args, client) {
  // Create instances Interact and SendMessage
  // Interact will be used to format the response
  // SendMessage will be used to send the response
  const interact = new Interact(client, roomId)
  const sendMessage = new SendMessage(client, roomId)

  // Extract infos from the user's message
  // Check if it's a response to a previous message for season, episode or quality
  if (args[1] && !args[1].startsWith('-') && (args[1] === 'saison' || args[1] === 'episode' || args[1] === 'quality')) {
    await mediaInfos.extractResponseInfo(args)
  } else {
    await mediaInfos.extractInfos(args)
  }

  // Format the response
  const res = await interact.formatResponse(mediaInfos)
  
  // Send the response
  if (res.text !== '') await sendMessage.sendReply(res, ev)
  else {
    const message = { text: "Je n'ai malheuresement pas trouvé de film ou serie correspondant... Essayez de préciser votre recherche ☹️", prompt: "" }
    await sendMessage.sendReply(message, ev)
  }

  // Check if all the infos are here
  // And search for torrents
  const torrents = await checkAndSearch()

  // Filter the torrents list
  // If there is a torrent that match the user's criteria
  // Download the torrent and reset the mediaInfos object
  if (torrents) {
    await sendMessage.send(`J'ai trouvé ${torrents.Results.length} torrents, je vais filtrer selon tes critères 🥸`)
    const torrent = await filter(torrents)
    if (torrent) {
      const torrentName = mediaInfos.torrentName
      const torrentType = mediaInfos.torrentType
      await sendMessage.send(`J'ai trouvé un torrent qui correspond à tes critères, je vais le télécharger 💪`)
      await downloadTorrent(torrent)
      mediaInfos = new ExtractMediaInfos()
      return sendMessage.send(`${torrentType === 'movie' ? 'Le film' : 'La série'} ${torrentName} est en train d'être téléchargé, je te préviens quand c'est fini 🚀!`)
    } else {
      const message = { text: "Je n'ai pas trouvé de torrents correspondants à vos critères... Essayez peut être une autre qualité? ☹️", prompt: "" }
      await sendMessage.sendReply(message, ev)
    }
  } else if (torrents && torrents.Results.length === 0) {
    const message = { text: "Je n'ai pas trouvé de torrents correspondants sur le web... Essayez de préciser votre recherche ☹️", prompt: "" }
    await sendMessage.sendReply(message, ev)
  }
}

module.exports = { runTorrentsCommand };