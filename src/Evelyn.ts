import '@abraham/reflection';

import { Client, DIService } from 'discordx';
import colors from '@colors/colors';
import { config } from '@Config';
import { container } from 'tsyringe';
import { Manager } from '@shadowrunners/automata';
import { dirname, importx } from '@discordx/importer';
import { GatewayIntentBits, Options } from 'discord.js';
import { BotConfig } from '@/Interfaces/Interfaces.js';
import { fileLoad } from '@Helpers/fileLoader.js';
import { DatabaseType, Giveaways } from 'discord-giveaways-super';
import { addTracingExtensions, init } from '@sentry/browser';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { tsyringeDependencyRegistryEngine } from '@discordx/di';
// import { crashReporter } from './functions/crashReport.js';
// import Economy from 'discord-economy-super/mongodb/src/index.js';

const {
	Guilds,
	GuildMessages,
	GuildMembers,
	GuildModeration,
	GuildEmojisAndStickers,
	GuildMessageReactions,
	GuildVoiceStates,
	MessageContent,
	DirectMessages,
} = GatewayIntentBits;

export class Evelyn extends Client {
	public config: BotConfig;
	// To implement later. This shit takes too much time.
	// public economy: Economy<boolean>;
	public manager: Manager;
	public giveaways: Giveaways<DatabaseType.MONGODB>;
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
				GuildMessageReactions,
				MessageContent,
				DirectMessages,
			],
			silent: false,
			makeCache: Options.cacheWithLimits({
				...Options.DefaultMakeCacheSettings,
				GuildInviteManager: 0,
				GuildScheduledEventManager: 0,
				PresenceManager: 0,
				ReactionUserManager: 0,
				StageInstanceManager: 0,
			}),
			sweepers: {
				...Options.DefaultSweeperSettings,
				messages: {
					// Clear the message cache every 12 hours.
					interval: 43200,
					filter: () => (message) =>
						// Removes all bots.
						message.author.bot && message.author.id !== this.client.user.id,
				},
			},
		});

		this.config = config;
		this.client = this;

		this.manager = new Manager({
			nodes: this.config.music.nodes,
			reconnectTries: 3,
			reconnectTimeout: 5000,
			resumeStatus: true,
			resumeTimeout: 5000,
			defaultPlatform: 'dzsearch',
		});

		this.giveaways = new Giveaways(this.client, {
			database: DatabaseType.MONGODB,
			connection: {
				connectionURI: this.config.database,
				dbName: '',
				collectionName: 'Giveaways',
			},
			debug: true,
		});

		// Replace this with Sentry stuff.
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
				)} ${colors.green(`${event.name}.ts`)}`,
			);
		}
	}

	/** Imports all commands and events then launches a new instance of the bot. */
	public async launch() {
		DIService.engine = tsyringeDependencyRegistryEngine.setInjector(container);

		await importx(
			`${dirname(import.meta.url)}/{Events/djxManaged,Commands}/**/*.{ts,js}`,
		);

		// Initialize Sentry
		addTracingExtensions();
		init({
			dsn: this.config.debug.telemetry,
			tracesSampleRate: 1.0,
			profilesSampleRate: 1.0,
			integrations: [
				new ProfilingIntegration(),
			],
		});

		console.log('Initialised Sentry.');

		await this.loadMusic(this);
		await this.client.login(this.config.token);
	}
}
