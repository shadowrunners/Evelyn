const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} = require("discord.js");
const Cluster = require("discord-hybrid-sharding");
const { Connectors } = require("shoukaku");
const { Kazagumo } = require("kazagumo");
const Spotify = require("kazagumo-spotify");
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
const { loadShoukakuNodes } = require("./handlers/shoukakuNodes.js");
const { loadShoukakuPlayer } = require("./handlers/shoukakuPlayer.js");
const { loadModals } = require("./handlers/modals.js");

client.config = require("./config.json");
client.commands = new Collection();
client.events = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
client.cluster = new Cluster.Client(client);
client.discordTogether = new DiscordTogether(client);

const kazagumoClient = new Kazagumo(
  {
    plugins: [
      new Spotify({
        clientId: client.config.spotifyClientID,
        clientSecret: client.config.spotifySecret,
      }),
    ],
    defaultSearchEngine: "youtube",
    send: (id, payload) => {
      const guild = client.guilds.cache.get(id);
      if (guild) guild.shard.send(payload);
    },
  },
  new Connectors.DiscordJS(client),
  client.config.nodes,
  {
    moveOnDisconnect: true,
    resume: true,
    reconnectTries: 5,
    restTimeout: 10000,
  }
);

client.manager = kazagumoClient;
module.exports = client;

loadEvents(client);
loadButtons(client);
loadShoukakuNodes(client);
loadShoukakuPlayer(client);
loadModals(client);

require("../utils/giveawaySystem.js")(client);

client.login(client.config.token);
