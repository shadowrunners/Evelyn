import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { GuildDB as DB } from '../../../structures/schemas/guild.js';
import { Subcommand } from '../../../Interfaces/interfaces.js';

const subCommand: Subcommand = {
	subCommand: 'levels.toggle',
	async execute(interaction: ChatInputCommandInteraction) {
		const { options, guildId } = interaction;
		const data = await DB.findOne({ id: guildId });
		const embed = new EmbedBuilder().setColor('Blurple');

		switch (options.getString('choice')) {
		case 'enable':
			if (data.levels.enabled === true)
				return interaction.reply({
					embeds: [
						embed.setDescription(
							'🔹 | The levelling system is already enabled.',
						),
					],
					ephemeral: true,
				});

			await DB.findOneAndUpdate(
				{ id: guildId },
				{ $set: { 'levels.enabled': true } },
			);

			return interaction.reply({
				embeds: [
					embed.setDescription('🔹 | The levelling system has been enabled.'),
				],
				ephemeral: true,
			});

		case 'disable':
			if (data.levels.enabled === false)
				return interaction.reply({
					embeds: [
						embed.setDescription(
							'🔹 | The levelling system is already disabled.',
						),
					],
					ephemeral: true,
				});

			await DB.findOneAndUpdate(
				{ id: guildId },
				{ $set: { 'levels.enabled': false } },
			);

			return interaction.reply({
				embeds: [
					embed.setDescription(
						'🔹 | The levelling system has been disabled.',
					),
				],
				ephemeral: true,
			});
		}
	},
};

export default subCommand;
