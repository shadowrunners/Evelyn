import { MusicUtils } from '../../../Modules/Utils/musicUtils.js';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Evelyn } from '../../../structures/Evelyn.js';
import { Subcommand } from '../../../interfaces/interfaces.js';

const subCommand: Subcommand = {
	subCommand: 'music.resume',
	async execute(interaction: ChatInputCommandInteraction, client: Evelyn) {
		const { guildId } = interaction;

		const embed = new EmbedBuilder().setColor('Blurple');
		const player = client.manager.players.get(guildId);
		const musicUtils = new MusicUtils(interaction, player);
		await interaction.deferReply();

		if (musicUtils.check(['voiceCheck'])) return;
		player.pause(false);

		return interaction.editReply({
			embeds: [embed.setDescription('🔹 | Resumed.')],
		});
	},
};

export default subCommand;