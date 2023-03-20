import { MusicUtils } from '../../../Modules/Utils/musicUtils.js';
import { ChatInputCommandInteraction } from 'discord.js';
import { Evelyn } from '../../../structures/Evelyn.js';
import { Subcommand } from '../../../interfaces/interfaces.js';

const subCommand: Subcommand = {
	subCommand: 'music.filters',
	async execute(interaction: ChatInputCommandInteraction, client: Evelyn) {
		const { guildId, options } = interaction;
		const player = client.manager.players.get(guildId);
		const musicUtils = new MusicUtils(interaction, player);
		await interaction.deferReply();

		if (musicUtils.check(['voiceCheck', 'checkPlaying'])) return;

		switch (options.getString('option')) {
		case '3d':
			return musicUtils.filters('3d');
		case 'bassboost':
			return musicUtils.filters('bassboost');
		case 'karaoke':
			return musicUtils.filters('karaoke');
		case 'nightcore':
			return musicUtils.filters('nightcore');
		case 'slowmo':
			return musicUtils.filters('slowmo');
		case 'soft':
			return musicUtils.filters('soft');
		case 'tv':
			return musicUtils.filters('tv');
		case 'treblebass':
			return musicUtils.filters('treblebass');
		case 'vaporwave':
			return musicUtils.filters('vaporwave');
		case 'vibrato':
			return musicUtils.filters('vibrato');
		case 'reset':
			return musicUtils.filters('reset');
		default:
			break;
		}
	},
};

export default subCommand;
