const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} = require("discord.js");
const Cluster = require("discord-hybrid-sharding");
const Deezer = require("erela.js-deezer");
const Apple = require("better-erela.js-apple").default;
const Spotify = require("better-erela.js-spotify").default;
const { Manager } = require("erela.js");
const { DiscordTogether } = require("discord-together");

const {
  Guilds,
  GuildBans,
  GuildMembers,
  GuildEmojisAndStickers,
  GuildInvites,
  GuildVoiceStates,
  GuildMessages,
  GuildMessageReactions,
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
    GuildMessageReactions,
  ],
  partials: [User, Message, Channel, GuildMember, ThreadMember],
  shards: Cluster.data.SHARD_LIST,
  shardCount: Cluster.data.TOTAL_SHARDS,
});

const { loadEvents } = require("./handlers/events.js");
const { loadButtons } = require("./handlers/buttons.js");
const { loadErela } = require("./handlers/erela.js");
const { loadModals } = require("./handlers/modals.js");

client.config = require("./config.json");
client.commands = new Collection();
client.events = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
client.cluster = new Cluster.Client(client);
client.discordTogether = new DiscordTogether(client);

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
loadButtons(client);
loadErela(client);
loadModals(client);

require("../utils/giveawaySystem.js")(client);

client.login(client.config.token);
