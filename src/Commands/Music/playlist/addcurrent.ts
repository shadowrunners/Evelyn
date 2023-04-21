import { PlaylistUtils } from '../../../Modules/Utils/playlistUtils.js';
import { ChatInputCommandInteraction } from 'discord.js';
import { Evelyn } from '../../../structures/Evelyn.js';
import { Subcommand } from '../../../interfaces/interfaces.js';

const subCommand: Subcommand = {
	subCommand: 'playlist.addcurrent',
	execute(interaction: ChatInputCommandInteraction, client: Evelyn) {
		const { options, guildId } = interaction;
		const playlistName = options.getString('name');
		const player = client.manager.players.get(guildId);

		if (!player) return;

		const utils = new PlaylistUtils(interaction);
		const { addCurrentTrack } = utils;

		return addCurrentTrack(player, playlistName);
	},
};

export default subCommand;
