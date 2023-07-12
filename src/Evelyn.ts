import { Client } from 'discordx';
import colors from '@colors/colors';
import { config } from './config.js';
import { Manager } from '@shadowrunners/automata';
import { dirname, importx } from '@discordx/importer';
import { IntentsBitField, Options } from 'discord.js';
import { BotConfig } from './Interfaces/Interfaces.js';
import { fileLoad } from './Utils/Utils/fileLoader.js';
// import { crashReporter } from './functions/crashReport.js';
// import Economy from 'discord-economy-super/mongodb/src/index.js';

const {
	Guilds,
	GuildMessages,
	GuildMembers,
	GuildModeration,
	GuildEmojisAndStickers,
	GuildVoiceStates,
	MessageContent,
	DirectMessages,
} = IntentsBitField.Flags;

export class Evelyn extends Client {
	public config: BotConfig;
	// To implement later. This shit takes too much time.
	// public economy: Economy<boolean>;
	public manager: Manager;
	private client: Client;

	constructor() {
		super({
			intents: [
				Guilds,
				GuildMembers,
				GuildMessages,
				GuildModeration,
				GuildVoiceStates,
				GuildEmojisAndStickers,
				MessageContent,
				DirectMessages,
			],
			silent: false,
			makeCache: Options.cacheWithLimits({
				...Options.DefaultMakeCacheSettings,
				ReactionManager: 0,
				GuildInviteManager: 0,
				GuildScheduledEventManager: 0,
				PresenceManager: 0,
				ReactionUserManager: 0,
				StageInstanceManager: 0,
			}),
			sweepers: {
				...Options.DefaultSweeperSettings,
				messages: {
					interval: 43200, // Clear the message cache every 12 hours.
					filter: () => (message) =>
						message.author.bot && message.author.id !== this.client.user.id, // Removes all bots.
				},
			},
		});

		this.config = config;

		this.manager = new Manager({
			nodes: this.config.music.nodes,
			reconnectTries: 3,
			reconnectTimeout: 10000,
			resumeKey: 'youshallresume',
			resumeTimeout: 5000,
			defaultPlatform: 'dzsearch',
		});

		this.client = this;

		// process.on('unhandledRejection', (err) => crashReporter(client, err));
		process.on('unhandledRejection', (err) => console.log(err));
		process.on('unhandledException', (err) => console.log(err));
	}
	
	/**
	 * Loads music events.
	 * @param {Evelyn} client - The client object.
	 * @returns {Promise<void>}
	 */
	async loadMusic(client: Evelyn): Promise<void> {
		const files = await fileLoad('Events/Automata');
		for (const file of files) {
			const eventModule = await import(`file://${file}`);
			const event = new eventModule.default();

			const execute = (...args: string[]) => event.execute(...args, client);

			client.manager.on(event.name, execute);

			console.log(
				`${colors.magenta('Automata')} ${colors.white(
					'· Loaded',
				)} ${colors.green(event.name + '.ts')}`,
			);
		}
	}

	/** Imports all commands and events then launches a new instance of the bot. */
	public async launch() {
		await importx(
			`${dirname(import.meta.url)}/{events/djxManaged,commands}/**/*.{ts,js}`,
		);

		await this.loadMusic(this);
		await this.client.login(this.config.token);
	}
}
