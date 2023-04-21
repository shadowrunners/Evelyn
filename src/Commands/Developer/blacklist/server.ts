import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { GuildDB as DB } from '../../../structures/schemas/guild.js';
import { Subcommand } from '../../../Interfaces/interfaces.js';

const subCommand: Subcommand = {
	subCommand: 'blacklist.server',
	async execute(interaction: ChatInputCommandInteraction) {
		const { options } = interaction;
		const guildID = options.getString('serverid');
		const blacklist_reason = options.getString('reason');
		const data = await DB.findOne({ id: guildID });
		const embed = new EmbedBuilder().setColor('Blurple');

		if (data?.blacklist?.isBlacklisted === true)
			return interaction.reply({
				embeds: [
					embed.setDescription('🔹 | This guild is already blacklisted.'),
				],
				ephemeral: true,
			});

		await DB.findOneAndUpdate(
			{
				id: guildID,
			},
			{
				$set: {
					blacklist: {
						isBlacklisted: true,
						reason: blacklist_reason,
						time: Date.now(),
					},
				},
			},
		);

		return interaction.reply({
			embeds: [
				embed.setDescription(
					`🔹 | This guild has been successfully blacklisted for ${blacklist_reason}`,
				),
			],
			ephemeral: true,
		});
	},
};

export default subCommand;
