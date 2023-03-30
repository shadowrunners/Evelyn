import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { GuildDB as DB } from '../../../structures/schemas/guild.js';
import { Subcommand } from '../../../Interfaces/interfaces.js';

const subCommand: Subcommand = {
	subCommand: 'goodbye.toggle',
	async execute(interaction: ChatInputCommandInteraction) {
		const { options, guildId } = interaction;
		const data = await DB.findOne({ id: guildId });
		const embed = new EmbedBuilder().setColor('Blurple');
		const choice = options.getString('choice');

		if (choice === 'enable' && data.goodbye.enabled === true)
			return interaction.reply({
				embeds: [
					embed.setDescription('🔹 | The goodbye system is already enabled.'),
				],
				ephemeral: true,
			});

		if (choice === 'disable' && data.goodbye.enabled === false)
			return interaction.reply({
				embeds: [
					embed.setDescription('🔹 | The goodbye system is already disabled.'),
				],
				ephemeral: true,
			});

		await DB.findOneAndUpdate(
			{ id: guildId },
			{ $set: { 'goodbye.enabled': choice === 'enable' ?? choice === 'false' } },
		);

		return interaction.reply({
			embeds: [
				embed.setDescription(
					`🔹 | The goodbye system has been ${
						choice === 'enable' ? 'enabled' : 'disabled'
					}.`,
				),
			],
			ephemeral: true,
		});
	},
};

export default subCommand;
