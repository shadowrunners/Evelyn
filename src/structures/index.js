const { Client, Collection } = require("discord.js");
const client = new Client({ intents: 32767 });
const Deezer = require("erela.js-deezer");
const Apple = require("erela.js-apple");
const { Manager } = require("erela.js");
const { token, nodes, SpotifyClientID, SpotifySecret } = require("./config.json");
const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
const { DiscordTogether } = require("discord-together");
const { LavasfyClient } = require("lavasfy");

client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.DiscordTogether = new DiscordTogether(client);

client.lavasfy = new LavasfyClient({
    clientID: SpotifyClientID,
    clientSecret: SpotifySecret,
    filterAudioOnlyResult: true,
    autoResolve: true,
    useSpotifyMetadata: true,
    playlistPageLoadLimit: 1,
},
    nodes
);

client.manager = new Manager({
    nodes,
    plugins: [
        new Apple(),
        new Deezer(),
    ],
    send: (id, payload) => {
        let guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
    },
});

module.exports = client;

require("../systems/giveawaySystem.js")(client);
require("../dashboard/dash.js");

["events", "commands", "buttons"].forEach(handler => {
    require(`./handlers/${handler}`)(client, PG);
});

client.login(token);