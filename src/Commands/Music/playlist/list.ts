import { PlaylistUtils } from '../../../Modules/Utils/playlistUtils.js';
import { Subcommand } from '../../../interfaces/interfaces.js';
import { ChatInputCommandInteraction } from 'discord.js';

const subCommand: Subcommand = {
	subCommand: 'playlist.list',
	execute(interaction: ChatInputCommandInteraction) {
		const utils = new PlaylistUtils(interaction);
		const { list } = utils;

		return list();
	},
};

export default subCommand;
