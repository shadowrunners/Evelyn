import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { GuildDB as DB } from '../../../structures/schemas/guild.js';
import { Subcommand } from '../../../Interfaces/interfaces.js';

const subCommand: Subcommand = {
	subCommand: 'confessions.toggle',
	async execute(interaction: ChatInputCommandInteraction) {
		const { options, guildId } = interaction;
		const data = await DB.findOne({ id: guildId });
		const embed = new EmbedBuilder().setColor('Blurple');
		const choice = options.getString('choice');

		if (choice === 'enable' && data.confessions.enabled === true)
			return interaction.reply({
				embeds: [
					embed.setDescription(
						'🔹 | The confessions system is already enabled.',
					),
				],
				ephemeral: true,
			});

		if (choice === 'disable' && data.confessions.enabled === false)
			return interaction.reply({
				embeds: [
					embed.setDescription(
						'🔹 | The confessions system is already disabled.',
					),
				],
				ephemeral: true,
			});

		await DB.findOneAndUpdate(
			{
				id: guildId,
			},
			{
				$set: {
					'confessions.enabled': choice === 'enable' ?? choice === 'false',
				},
			},
		);

		return interaction.reply({
			embeds: [
				embed.setDescription(
					`🔹 | The confessions system has been ${
						choice === 'enable' ? 'enabled' : 'disabled'
					}.`,
				),
			],
			ephemeral: true,
		});
	},
};

export default subCommand;
