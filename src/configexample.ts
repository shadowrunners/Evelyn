import { botConfig } from './Interfaces/Interfaces';

export const config: botConfig = {
	token: '',
	database: '',
	ownerIDs: [],
	decryptionKey: '',

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
		omdbAPIKey: '',
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
