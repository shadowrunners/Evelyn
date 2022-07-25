const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} = require("discord.js");

const { Guilds, GuildBans, GuildInvites, GuildVoiceStates, GuildMessages } =
  GatewayIntentBits;
const { User, Message, Channel, GuildMember, ThreadMember } = Partials;

const { loadEvents } = require("./handlers/events.js");
const { loadCommands } = require("./handlers/commands.js");

const client = new Client({
  intents: [Guilds, GuildBans, GuildInvites, GuildVoiceStates, GuildMessages],
  partials: [User, Message, Channel, GuildMember, ThreadMember],
});

client.config = require("./config.json");
client.commands = new Collection();

module.exports = client;

client.login(client.config.token).then(() => {
  loadEvents(client);
  loadCommands(client);
});
