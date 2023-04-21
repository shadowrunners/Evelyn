import { PlaylistUtils } from '../../../Modules/Utils/playlistUtils.js';
import { Subcommand } from '../../../interfaces/interfaces.js';
import { ChatInputCommandInteraction } from 'discord.js';

const subCommand: Subcommand = {
	subCommand: 'playlist.removesong',
	execute(interaction: ChatInputCommandInteraction) {
		const { options } = interaction;
		const pName = options.getString('name');
		const song = options.getNumber('songid');
		const utils = new PlaylistUtils(interaction);

		const { removeThisSong } = utils;
		return removeThisSong(pName, song);
	},
};

export default subCommand;
