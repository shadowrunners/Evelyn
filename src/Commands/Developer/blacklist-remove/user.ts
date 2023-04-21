import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { UserBlacklist as UB } from '../../../structures/schemas/userBlacklist';
import { Subcommand } from '../../../Interfaces/interfaces.js';

const subCommand: Subcommand = {
	subCommand: 'blacklist-remove.user',
	async execute(interaction: ChatInputCommandInteraction) {
		const { options } = interaction;
		const userID = options.getString('userid');
		const data = await UB.findOne({ userId: userID });
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		if (!data) {
			return interaction.reply({
				embeds: [embed.setDescription('This user isn\'t blacklisted.')],
			});
		}

		await data.deleteOne({ userId: userID });

		return interaction.reply({
			embeds: [
				embed.setDescription(
					'🔹 | This user has been removed from the blacklist.',
				),
			],
		});
	},
};

export default subCommand;
