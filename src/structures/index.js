const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} = require("discord.js");
const Deezer = require("erela.js-deezer");
const Apple = require("erela.js-apple");
const { Manager } = require("erela.js");
const { LavasfyClient } = require("lavasfy");
const { DiscordTogether } = require("discord-together");

const {
  Guilds,
  GuildBans,
  GuildMembers,
  GuildEmojisAndStickers,
  GuildInvites,
  GuildVoiceStates,
  GuildMessages,
  MessageContent,
} = GatewayIntentBits;
const { User, Message, Channel, GuildMember, ThreadMember } = Partials;

const { loadEvents } = require("./handlers/events.js");
const { loadCommands } = require("./handlers/commands.js");

const client = new Client({
  intents: [
    Guilds,
    GuildBans,
    GuildMembers,
    GuildEmojisAndStickers,
    GuildInvites,
    GuildVoiceStates,
    GuildMessages,
    MessageContent,
  ],
  partials: [User, Message, Channel, GuildMember, ThreadMember],
});

client.config = require("./config.json");
client.commands = new Collection();
client.DiscordTogether = new DiscordTogether(client);

client.lavasfy = new LavasfyClient(
  {
    clientID: client.config.spotifyClientID,
    clientSecret: client.config.spotifySecret,
    filterAudioOnlyResult: true,
    autoResolve: true,
    useSpotifyMetadata: true,
    playlistPageLoadLimit: 1,
  },
  client.config.nodes
);

client.manager = new Manager({
  nodes: client.config.nodes,
  plugins: [new Apple(), new Deezer()],
  send: (id, payload) => {
    let guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },
});

module.exports = client;

client.login(client.config.token).then(() => {
  loadEvents(client);
  loadCommands(client);
});
