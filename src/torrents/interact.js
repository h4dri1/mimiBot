const SendMessage = require('../services/sendMessage')
const { tvPrompt, qualityPrompt } = require('../messages/torrents/prompts')
const { episodeOrSeason, wischQuality, wischQualityTv, download } = require('../messages/torrents/messages')

class Interact {

  constructor(client, roomId) {
    this.client = client;
    this.roomId = roomId;
    this.message = '';
    this.msgType = '';
    this.sendMessage = new SendMessage(client, roomId);
  }

  // Prepare the message to send
  // Format the message depending on the user input
  async formatResponse(mediaInfos) {
    this.msgType = "m.notice";
    let message = { prompt: "", text: "" };
    if (mediaInfos.torrentType === "tv") {
      if (!mediaInfos.torrentSeason) {
        message.prompt = tvPrompt;
        message.text = episodeOrSeason;
      } else if (!mediaInfos.torrentQuality) {
        message.prompt = qualityPrompt;
        message.text = wischQualityTv;
      } else {
        message.text = download;
      }
    } else if (mediaInfos.torrentType === "movie") {
      if (!mediaInfos.torrentQuality) {
        message.prompt = qualityPrompt;
        message.text = wischQuality;
      } else {
        message.text = download;
      }
    }
    return message
  }

}

module.exports = Interact;