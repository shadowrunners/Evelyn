import { MusicUtils } from '../../../Modules/Utils/musicUtils.js';
import { ChatInputCommandInteraction } from 'discord.js';
import { Evelyn } from '../../../structures/Evelyn.js';
import { Subcommand } from '../../../interfaces/interfaces.js';

const subCommand: Subcommand = {
	subCommand: 'music.volume',
	async execute(interaction: ChatInputCommandInteraction, client: Evelyn) {
		const { options, guildId } = interaction;

		const player = client.manager.players.get(guildId);
		const percent = options.getNumber('percent', true);
		const musicUtils = new MusicUtils(interaction, player);

		await interaction.deferReply();

		if (musicUtils.check(['voiceCheck'])) return;

		return musicUtils.setVolume(percent);
	},
};

export default subCommand;
