import { PlaylistUtils } from '../../../Modules/Utils/playlistUtils.js';
import { Subcommand } from '../../../interfaces/interfaces.js';
import { ChatInputCommandInteraction } from 'discord.js';

const subCommand: Subcommand = {
	subCommand: 'playlist.info',
	async execute(interaction: ChatInputCommandInteraction) {
		const { options } = interaction;
		const pName = options.getString('name');
		const utils = new PlaylistUtils(interaction);

		const { info } = utils;
		return info(pName);
	},
};

export default subCommand;
