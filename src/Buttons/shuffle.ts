import { ButtonInteraction, EmbedBuilder } from 'discord.js';
import { Evelyn } from '../structures/Evelyn.js';
import { Buttons } from '../Interfaces/interfaces.js';
import { MusicUtils } from '../Modules/Utils/musicUtils.js';

const button: Buttons = {
	id: 'shuffle',
	async execute(interaction: ButtonInteraction, client: Evelyn) {
		const { guildId, user } = interaction;

		const player = client.manager.players.get(guildId);
		const embed = new EmbedBuilder().setColor('Blurple');
		const musicUtils = new MusicUtils(interaction, player);

		await interaction.deferReply();

		if (musicUtils.check(['voiceCheck'])) return;

		player.queue.shuffle();

		return interaction.editReply({
			embeds: [
				embed.setDescription('🔹 | Shuffled the queue.').setFooter({
					text: `Action executed by ${user.username}.`,
					iconURL: user.avatarURL(),
				}),
			],
		});
	},
};

export default button;
