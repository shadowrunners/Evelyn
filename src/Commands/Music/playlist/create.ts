import { PlaylistUtils } from '../../../Modules/Utils/playlistUtils.js';
import { Subcommand } from '../../../interfaces/interfaces.js';
import { ChatInputCommandInteraction } from 'discord.js';

const subCommand: Subcommand = {
	subCommand: 'playlist.create',
	async execute(interaction: ChatInputCommandInteraction) {
		const { options } = interaction;
		const utils = new PlaylistUtils(interaction);
		const pName = options.getString('name');

		const { create } = utils;

		return create(pName);
	},
};

export default subCommand;
