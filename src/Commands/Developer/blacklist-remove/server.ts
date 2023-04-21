import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { GuildDB as DB } from '../../../structures/schemas/guild.js';
import { Subcommand } from '../../../Interfaces/interfaces.js';

const subCommand: Subcommand = {
	subCommand: 'blacklist-remove.server',
	async execute(interaction: ChatInputCommandInteraction) {
		const { options } = interaction;
		const guildID = options.getString('serverid');
		const data = await DB.findOne({ id: guildID });
		const embed = new EmbedBuilder().setColor('Blurple');

		if (!data)
			return interaction.reply({
				embeds: [embed.setDescription('🔹 | This guild isn\'t blacklisted.')],
				ephemeral: true,
			});

		await DB.findOneAndUpdate(
			{
				id: guildID,
			},
			{
				$set: {
					blacklist: {
						isBlacklisted: false,
					},
				},
			},
		);

		return interaction.reply({
			embeds: [
				embed.setDescription(
					'🔹 | This guild has been removed from the blacklist.',
				),
			],
			ephemeral: true,
		});
	},
};

export default subCommand;
