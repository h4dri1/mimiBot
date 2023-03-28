const { LogService, MessageEvent, RichReply, UserID } = require("matrix-bot-sdk");
const { runHelloCommand } = require("./hello");
const { runTorrentsCommand } = require("./torrents");
const { help, helpTorrents, hello } = require("../messages/help/prompt");
const SendMessage = require("../services/sendMessage");

// The prefix required to trigger the bot. The bot will also respond
// to being pinged directly.
const COMMAND_PREFIX = "!mimi";

// This is where all of our commands will be handled
class CommandHandler {

    // Just some variables so we can cache the bot's display name and ID
    // for command matching later.
    constructor(client) {
        this.client = client;
        this.displayName = null;
        this.userId = null;
        this.localpart = null;
        this.joinedRooms = [];
    }

    async start() {
        // Populate the variables above (async)
        await this.prepareProfile();
        this.joinedRooms = await this.client.getJoinedRooms()

        // Set up the event handler
        this.client.on("room.message", this.onMessage.bind(this));
    }

    async prepareProfile() {
        this.userId = await this.client.getUserId();
        this.localpart = new UserID(this.userId).localpart;

        try {
            const profile = await this.client.getUserProfile(this.userId);
            if (profile && profile['displayname']) this.displayName = profile['displayname'];
        } catch (e) {
            // Non-fatal error - we'll just log it and move on.
            LogService.warn("CommandHandler", e);
        }
    }

    async onMessage(roomId, ev) {
        const sendMess = new SendMessage(this.client, roomId);
        const event = new MessageEvent(ev);
        if (event.isRedacted) return; // Ignore redacted events that come through
        if (event.sender === this.userId) return; // Ignore ourselves
        if (event.messageType !== "m.text") return; // Ignore non-text messages

        // Ensure that the event is a command before going on. We allow people to ping
        // the bot as well as using our COMMAND_PREFIX.
        const prefixes = [COMMAND_PREFIX, `${this.localpart}:`, `${this.displayName}:`, `${this.userId}:`];
        const prefixUsed = prefixes.find(p => event.textBody.startsWith(p));
        if (!prefixUsed) return; // Not a command (as far as we're concerned)

        // Check to see what the arguments were to the command
        const args = event.textBody.substring(prefixUsed.length).trim().split(' ');

        // Try and figure out what command the user ran, defaulting to help
        try {
            let message = { prompt: "", text: "" };
            if (args[0] === "hello") {
                return runHelloCommand(roomId, event, args, this.client);
            } else if (args[0] === "trouve") {
                return runTorrentsCommand(roomId, event, args, this.client);
            } else if ((args[0] === "help" || args[0] === "") && args[1] !== "torrents") {
                message.prompt = help;
                message.text = `Help menu`;
                return sendMess.sendReply(message, ev);
            } else if (args[0] === "help" && args[1] === "torrents") {
                message.prompt = helpTorrents;
                message.text = `Torrents help menu`;
                return sendMess.sendReply(message, ev);
            }
        } catch (e) {
            // Log the error
            LogService.error("CommandHandler", e);

            // Tell the user there was a problem
            const message = "There was an error processing your command";
            return this.client.replyNotice(roomId, ev, message);
        }
    }
}

module.exports = CommandHandler;
