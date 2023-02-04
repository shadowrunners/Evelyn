// eslint-disable-next-line no-unused-vars
const { ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const GDB = require('../../../structures/schemas/guild.js');

module.exports = {
	subCommand: 'blacklist.server',
	/**
	 * @param {ChatInputCommandInteraction} interaction,
	 */
	async execute(interaction) {
		const { options } = interaction;
		const guildID = options.getString('serverid');
		const blacklist_reason = options.getString('reason');
		const data = await GDB.findOne({ id: guildID });
		const embed = new EmbedBuilder().setColor('Blurple');

		console.log(data);

		if (data?.blacklist?.isBlacklisted === true)
			return interaction.reply({
				embeds: [
					embed.setDescription('🔹 | This guild is already blacklisted.'),
				],
				ephemeral: true,
			});

		await GDB.findOneAndUpdate(
			{
				id: guildID,
			}, {
			$set: {
				blacklist: {
					isBlacklisted: true,
					reason: blacklist_reason,
					time: Date.now()
				}
			}
		});

		return interaction.reply({
			embeds: [
				embed.setDescription(
					`🔹 | This guild has been successfully blacklisted for ``${blacklist_reason}```,
				),
			],
			ephemeral: true,
		});
	},
};
