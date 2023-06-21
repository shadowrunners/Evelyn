import { Client } from 'discordx';
import Statcord from 'statcord.js';
import colors from '@colors/colors';
import { Manager } from '@shadowrunners/automata';
import { fileLoad } from './Utils/Utils/fileLoader.js';
import { dirname, importx } from '@discordx/importer';
import { IntentsBitField, Options } from 'discord.js';
import { botConfig } from './Interfaces/Interfaces.js';
// import { crashReporter } from './functions/crashReport.js';
// import Economy from 'discord-economy-super/mongodb/src/index.js';
import { config } from './config.js';

const {
	Guilds,
	GuildMessages,
	GuildMembers,
	GuildModeration,
	GuildEmojisAndStickers,
	GuildMessageReactions,
	GuildVoiceStates,
	GuildPresences,
	MessageContent,
	DirectMessages,
} = IntentsBitField.Flags;

export class Evelyn extends Client {
	public config: botConfig;
	// To implement later. This shit takes too much time.
	// public economy: Economy<boolean>;
	public statcord: Statcord.Client;
	public manager: Manager;
	private client: Client;

	constructor() {
		super({
			intents: [
				Guilds,
				GuildMembers,
				GuildMessages,
				GuildPresences,
				GuildModeration,
				GuildVoiceStates,
				GuildMessageReactions,
				GuildEmojisAndStickers,
				MessageContent,
				DirectMessages,
			],
			silent: false,
			makeCache: Options.cacheWithLimits({
				...Options.DefaultMakeCacheSettings,
				ReactionManager: 0,
				GuildInviteManager: 0,
			}),
			sweepers: Options.DefaultSweeperSettings,
		});

		this.config = config;

		this.statcord = new Statcord.Client({
			client: this,
			key: this.config.debug.statKey,
			postCpuStatistics: true,
			postMemStatistics: true,
			postNetworkStatistics: true,
		});

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
	 * Loads Statcord events.
	 * @param {Evelyn} client - The client object.
	 * @returns {Promise<void>}
	 */
	async loadStats(client: Evelyn): Promise<void> {
		const files = await fileLoad('Events/statcord');
		for (const file of files) {
			const event = await import(`file://${file}`);
			const execute = (...args: string[]) =>
				event.default.execute(...args, client);

			client.statcord.once(event.default.name, execute);

			return console.log(
				`${colors.magenta('Statcord')} ${colors.white(
					'· Loaded',
				)} ${colors.green(event.default.name + '.ts')}`,
			);
		}
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

		await this.loadStats(this);
		await this.loadMusic(this);

		await this.client.login(this.config.token);
	}
}
