import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { GuildDB as DB } from '../../../structures/schemas/guild.js';
import { Subcommand } from '../../../Interfaces/interfaces.js';

const subCommand: Subcommand = {
	subCommand: 'welcome.toggle',
	async execute(interaction: ChatInputCommandInteraction) {
		const { options, guildId } = interaction;
		const data = await DB.findOne({ id: guildId });
		const embed = new EmbedBuilder().setColor('Blurple');

		switch (options.getString('choice')) {
		case 'enable':
			if (data.welcome.enabled === true)
				return interaction.reply({
					embeds: [
						embed.setDescription(
							'🔹 | The welcome system is already enabled.',
						),
					],
					ephemeral: true,
				});

			await DB.findOneAndUpdate(
				{ id: guildId },
				{ $set: { 'welcome.enabled': true } },
			);

			return interaction.reply({
				embeds: [
					embed.setDescription('🔹 | The welcome system has been enabled.'),
				],
				ephemeral: true,
			});

		case 'disable':
			if (data.welcome.enabled === false)
				return interaction.reply({
					embeds: [
						embed.setDescription(
							'🔹 | The welcome system is already disabled.',
						),
					],
					ephemeral: true,
				});

			await DB.findOneAndUpdate(
				{ id: guildId },
				{ $set: { 'welcome.enabled': false } },
			);

			return interaction.reply({
				embeds: [
					embed.setDescription('🔹 | The welcome system has been disabled.'),
				],
				ephemeral: true,
			});
		}
	},
};

export default subCommand;
