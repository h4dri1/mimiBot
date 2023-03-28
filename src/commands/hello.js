const { MatrixClient, MentionPill, MessageEvent, MessageEventContent } = require("matrix-bot-sdk");
const htmlEscape = require("escape-html");

async function runHelloCommand(roomId, event, args, client) {
    // The first argument is always going to be us, so get the second argument instead.
    let sayHelloTo = args[1];
    if (!sayHelloTo) sayHelloTo = event.sender;

    let text = `Hello ${sayHelloTo}!`;
    let html = `Hello ${htmlEscape(sayHelloTo)}!`;

    if (sayHelloTo.startsWith("@")) {
        // Awesome! The user supplied an ID so we can create a proper mention instead
        const mention = await MentionPill.forUser(sayHelloTo, roomId, client);
        text = `Hello ${mention.text}!`;
        html = `Hello ${mention.html}!`;
    }

    // Now send that message as a notice
    return client.sendMessage(roomId, {
        body: text,
        msgtype: "m.notice",
        format: "org.matrix.custom.html",
        formatted_body: html,
    });
}

module.exports = { runHelloCommand };