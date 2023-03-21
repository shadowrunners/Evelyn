import {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	ModalSubmitInteraction,
	PermissionFlagsBits,
	SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';
import { Evelyn } from '../structures/Evelyn.js';

export interface Command {
	// botPermissions?: [typeof PermissionFlagsBits];
	developer?: boolean | false;
	data:
		| SlashCommandBuilder
		| SlashCommandSubcommandsOnlyBuilder
		| Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
	execute?: (interaction: ChatInputCommandInteraction, client: Evelyn) => void;
}

export interface Subcommand {
	subCommand: string;
	execute?: (...args: any) => void;
}

export interface Event {
	name: string;
	once?: boolean | false;
	rest?: {
		once?: boolean | false;
		rest?: boolean | false;
	};
	execute: (...args: any[]) => void;
}

export interface Buttons {
	id: string;
	execute: (...args: any) => void;
}

export interface Modals {
	id: string;
	// permission?: PermissionFlags;
	developer?: string;
	execute: (interaction: ModalSubmitInteraction, client: Evelyn) => void;
}

export interface botConfig {
	/** The bot's token. */
	token: string;
	/** The MongoDB database URI. */
	database: string;
	/** The array of IDs for the owners / developers of the bot. */
	ownerIDs: [];
	debug: {
		devGuild: string;
		overwatchChannel: string;
		statKey: string;
		watcherHook: string;
	};
	APIs: {
		/** The API key generated by the Genius Developer Portal. */
		geniusKey: string;
		/** The API key generated by the The Cat API Dashboard. */
		cattoKey: string;
		/** The API key generated by the IMDb API Portal. */
		imdbAPIKey: string;
	};
	music: {
		/** The array of lavalink nodes. */
		nodes: [];
	};
}
