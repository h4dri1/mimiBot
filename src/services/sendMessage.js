const { RichReply } = require("matrix-bot-sdk");
const htmlEscape = require("escape-html");

class SendMessage {

  constructor(client, roomId) {
    this.client = client;
    this.roomId = roomId;
    this.message = '';
    this.msgType = '';
  }

  async send(message) {
    this.message = message;
    this.msgType = "m.text";
    return this.client.sendMessage(this.roomId, {
      body: this.message,
      msgtype: this.msgType,
    });
  }

  async sendReply(message, ev) {
    const html = `<b>${message.text}:</b><br /><pre><code>${htmlEscape(message.prompt)}</code></pre>`;
    const reply = RichReply.createFor(this.roomId, ev, message.text, message.prompt !== '' ? html : message.text); // Note that we're using the raw event, not the parsed one!
    reply["msgtype"] = "m.notice"; // Bots should always use notices

    return this.client.sendMessage(this.roomId, reply);
  }

}

module.exports = SendMessage;