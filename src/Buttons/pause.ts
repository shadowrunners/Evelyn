import { ButtonInteraction, EmbedBuilder } from 'discord.js';
import { Evelyn } from '../structures/Evelyn.js';
import { Buttons } from '../Interfaces/interfaces.js';
import { MusicUtils } from '../Modules/Utils/musicUtils.js';

const button: Buttons = {
	id: 'pause',
	async execute(interaction: ButtonInteraction, client: Evelyn) {
		const { guildId, user } = interaction;

		const player = client.manager.players.get(guildId);
		const musicUtils = new MusicUtils(interaction, player);
		const embed = new EmbedBuilder().setColor('Blurple').setFooter({
			text: `Action executed by ${user.username}.`,
			iconURL: user.avatarURL(),
		});

		await interaction.deferReply();

		if (musicUtils.check(['voiceCheck'])) return;

		if (!player.isPaused) {
			player.pause(true);
			return interaction.editReply({
				embeds: [embed.setDescription('🔹 | Paused.')],
			});
		}

		if (player.isPaused) {
			player.pause(false);

			return interaction.editReply({
				embeds: [embed.setDescription('🔹 | Resumed.')],
			});
		}
	},
};

export default button;
