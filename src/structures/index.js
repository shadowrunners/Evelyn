const {
	Client,
	Collection,
	GatewayIntentBits,
	Partials,
} = require('discord.js');
const Statcord = require('statcord.js');

const Economy = require('discord-economy-super/mongodb');
const { Manager } = require('erela.js');
const { crashReporter } = require('../functions/crashReport');

const {
	Guilds,
	GuildMessages,
	GuildBans,
	GuildMembers,
	GuildEmojisAndStickers,
	GuildMessageReactions,
	GuildInvites,
	GuildVoiceStates,
	MessageContent,
} = GatewayIntentBits;
const { User, Message, Channel, GuildMember, ThreadMember } = Partials;

const client = new Client({
	intents: [
		Guilds,
		GuildBans,
		GuildInvites,
		GuildMembers,
		GuildMessages,
		GuildVoiceStates,
		GuildMessageReactions,
		GuildEmojisAndStickers,
		MessageContent,
	],
	partials: [User, Message, Channel, GuildMember, ThreadMember],
});

const { loadEco } = require('./handlers/economy.js');
const { loadEvents } = require('./handlers/events.js');
const { loadStats } = require('./handlers/statcord.js');
const { loadButtons } = require('./handlers/buttons.js');
const { loadMusic } = require('./handlers/erela.js');
const { loadModals } = require('./handlers/modals.js');

client.config = require('./config.json');
client.commands = new Collection();
client.subCommands = new Collection();
client.events = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
client.economy = new Economy({
	connection: {
		connectionURI: client.config.database,
		collectionName: 'economy',
		dbName: 'test',
	},
	dailyAmount: 80,
	workAmount: [60, 100],
	weeklyAmount: 300,
});

client.statcord = new Statcord.Client({
	client,
	key: client.config.debug.statKey,
	postCpuStatistics: true,
	postMemStatistics: true,
	postNetworkStatistics: true,
	autopost: true,
});

client.manager = new Manager({
	nodes: client.config.music.nodes,
	defaultPlatform: 'deezer',
	resumeKey: 'youshallresume',
	resumeTimeout: 10000,
	restTimeout: 10000,
	send: (id, payload) => {
		const guild = client.guilds.cache.get(id);
		if (guild) guild.shard.send(payload);
	},
});

module.exports = client;

loadEco(client);
loadStats(client);
loadEvents(client);
loadModals(client);
loadButtons(client);
loadMusic(client);

// process.on('unhandledRejection', (err) => crashReporter(client, err));
process.on('unhandledRejection', (err) => console.log(err));
process.on('unhandledException', (err) => console.log(err));

client.login(client.config.token);
