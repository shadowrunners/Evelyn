const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} = require("discord.js");
const Deezer = require("erela.js-deezer");
const Apple = require("better-erela.js-apple").default;
const Spotify = require("better-erela.js-spotify").default;
const { Manager } = require("erela.js");

const {
  Guilds,
  GuildBans,
  GuildMembers,
  GuildEmojisAndStickers,
  GuildInvites,
  GuildVoiceStates,
  GuildMessages,
} = GatewayIntentBits;
const { User, Message, Channel, GuildMember, ThreadMember } = Partials;

const client = new Client({
  intents: [
    Guilds,
    GuildBans,
    GuildMembers,
    GuildEmojisAndStickers,
    GuildInvites,
    GuildVoiceStates,
    GuildMessages,
  ],
  partials: [User, Message, Channel, GuildMember, ThreadMember],
});

const { loadEvents } = require("./handlers/events.js");
const { loadCommands } = require("./handlers/commands.js");

client.config = require("./config.json");
client.commands = new Collection();
client.events = new Collection();

client.manager = new Manager({
  nodes: client.config.nodes,
  plugins: [
    new Spotify({
      clientID: client.config.spotifyClientID,
      clientSecret: client.config.spotifySecret,
    }),
    new Apple(),
    new Deezer(),
  ],
  send: (id, payload) => {
    let guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },
});

module.exports = client;

loadEvents(client);

client.login(client.config.token).then(() => {
  loadCommands(client);
});
