import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { UserBlacklist as UB } from '../../../structures/schemas/userBlacklist';
import { Subcommand } from '../../../Interfaces/interfaces.js';

const subCommand: Subcommand = {
	subCommand: 'blacklist.user',
	async execute(interaction: ChatInputCommandInteraction) {
		const { options } = interaction;
		const userID = options.getString('userid');
		const blacklist_reason = options.getString('reason');
		const data = await UB.findOne({ userId: userID });
		const embed = new EmbedBuilder().setColor('Blurple');

		if (data)
			return interaction.reply({
				embeds: [
					embed.setDescription('🔹 | This user is already blacklisted.'),
				],
			});

		await UB.create({
			userId: userID,
			reason: blacklist_reason,
			time: Date.now(),
		});

		return interaction.reply({
			embeds: [
				embed.setDescription(
					`🔹 | This user has been successfully blacklisted for ${blacklist_reason}.`,
				),
			],
		});
	},
};

export default subCommand;
