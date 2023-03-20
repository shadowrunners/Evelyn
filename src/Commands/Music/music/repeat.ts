import { MusicUtils } from '../../../Modules/Utils/musicUtils.js';
import { ChatInputCommandInteraction } from 'discord.js';
import { Evelyn } from '../../../structures/Evelyn.js';
import { Subcommand } from '../../../interfaces/interfaces.js';

const subCommand: Subcommand = {
	subCommand: 'music.repeat',
	async execute(interaction: ChatInputCommandInteraction, client: Evelyn) {
		const { options, guildId } = interaction;
		const player = client.manager.players.get(guildId);
		const musicUtils = new MusicUtils(interaction, player);
		await interaction.deferReply();

		if (musicUtils.check(['voiceCheck'])) return;

		switch (options.getString('type')) {
		case 'queue':
			return musicUtils.repeatMode('queue');
		case 'song':
			return musicUtils.repeatMode('song');
		case 'off':
			return musicUtils.repeatMode('off');
		default:
			break;
		}
	},
};

export default subCommand;
