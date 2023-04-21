import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { GuildDB as DB } from '../../../structures/schemas/guild.js';
import { Subcommand } from '../../../Interfaces/interfaces.js';

const subCommand: Subcommand = {
	subCommand: 'logs.toggle',
	async execute(interaction: ChatInputCommandInteraction) {
		const { options, guildId } = interaction;
		const data = await DB.findOne({ id: guildId });
		const embed = new EmbedBuilder().setColor('Blurple');

		switch (options.getString('choice')) {
		case 'enable':
			if (data.logs.enabled === true)
				return interaction.reply({
					embeds: [
						embed.setDescription(
							'🔹 | The logging system is already enabled.',
						),
					],
					ephemeral: true,
				});

			await DB.findOneAndUpdate(
				{ id: guildId },
				{ $set: { 'logs.enabled': true } },
			);

			return interaction.reply({
				embeds: [
					embed.setDescription('🔹 | The logging system has been enabled.'),
				],
				ephemeral: true,
			});

		case 'disable':
			if (data.logs.enabled === false)
				return interaction.reply({
					embeds: [
						embed.setDescription(
							'🔹 | The logging system is already disabled.',
						),
					],
					ephemeral: true,
				});

			await DB.findOneAndUpdate(
				{ id: guildId },
				{ $set: { 'logs.enabled': false } },
			);

			return interaction.reply({
				embeds: [
					embed.setDescription('🔹 | The logging system has been disabled.'),
				],
				ephemeral: true,
			});
		}
	},
};

export default subCommand;
