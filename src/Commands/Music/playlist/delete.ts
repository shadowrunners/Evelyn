import { PlaylistUtils } from '../../../Modules/Utils/playlistUtils.js';
import { Subcommand } from '../../../interfaces/interfaces.js';
import { ChatInputCommandInteraction } from 'discord.js';

const subCommand: Subcommand = {
	subCommand: 'playlist.delete',
	execute(interaction: ChatInputCommandInteraction) {
		const { options } = interaction;
		const utils = new PlaylistUtils(interaction);
		const pName = options.getString('name');

		return utils.delete(pName);
	},
};

export default subCommand;
