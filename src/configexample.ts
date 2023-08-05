import { BotConfig } from './Interfaces/Interfaces.js';

export const config: BotConfig = {
	token: '',
	database: '',
	ownerIDs: [],
	decryptionKey: '',
	userAgent: 'examplebot@example (https://github.com/shadowrunners/Evelyn)',

	debug: {
		devGuild: '',
		overwatchChannel: '',
		statKey: '',
		watcherHook: '',
	},
	APIs: {
		rawgKey: '',
		geniusKey: '',
		cattoKey: '',
		tmdbAPIKey: '',
	},
	music: {
		nodes: [
			{
				name: 'Evelyn - Node 03',
				host: 'localhost',
				port: 7734,
				password: '',
				secure: false,
			},
		],
	},
};
