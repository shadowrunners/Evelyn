// eslint-disable-next-line no-unused-vars
const { ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const UB = require('../../../structures/schemas/userBlacklist.js');

module.exports = {
	subCommand: 'blacklist.user',
	/**
	 * @param {ChatInputCommandInteraction} interaction,
	 */
	async execute(interaction) {
		const { options } = interaction;
		const userID = options.getString('userid');
		const blacklist_reason = options.getString('reason');
		const data = await UB.findOne({ userId: userID });
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		if (data) {
			return interaction.reply({
				embeds: [
					embed.setDescription('🔹 | This user is already blacklisted.'),
				],
			});
		}

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
