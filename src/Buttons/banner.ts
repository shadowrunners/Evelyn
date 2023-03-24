import { EmbedBuilder, ButtonInteraction } from 'discord.js';
import { Buttons } from '../Interfaces/interfaces.js';

const button: Buttons = {
	botPermissions: ['SendMessages', 'EmbedLinks'],
	id: 'banner',
	async execute(interaction: ButtonInteraction) {
		const { user } = interaction;
		await user.fetch();

		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor('Blurple')
					.setTitle(`${user.tag}'s Avatar`)
					.setImage(user.avatarURL({ size: 4096 }))
					.setURL(user.avatarURL({ size: 4096 })),
			],
			ephemeral: true,
		});
	},
};

export default button;
