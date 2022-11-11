const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} = require("discord.js");
const Cluster = require("discord-hybrid-sharding");
const { Poru } = require("poru");

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
  shards: Cluster.data.SHARD_LIST,
  shardCount: Cluster.data.TOTAL_SHARDS,
});

const { loadEvents } = require("./handlers/events.js");
const { loadButtons } = require("./handlers/buttons.js");
const { loadPoru } = require("./handlers/poru.js");
const { loadModals } = require("./handlers/modals.js");

client.config = require("./config.json");
client.commands = new Collection();
client.subCommands = new Collection();
client.events = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
client.cluster = new Cluster.Client(client);

client.manager = new Poru(client, client.config.nodes, {
  deezer: {
    playlistLimit: 10,
  },
  spotify: {
    clientID: client.config.spotifyClientID,
    clientSecret: client.config.spotifySecret,
    playlistLimit: 5,
  },
  defaultPlatform: "ytsearch",
  resumeKey: "MyPlayers",
  resumeTimeout: 60,
  reconnectTries: 5,
});

module.exports = client;

loadEvents(client);
loadButtons(client);
loadPoru(client);
loadModals(client);

client.login(client.config.token);
