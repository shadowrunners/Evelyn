// eslint-disable-next-line no-unused-vars
const { ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const GDB = require('../../../structures/schemas/guild.js');

module.exports = {
	subCommand: 'blacklist-remove.server',
	/**
	 * @param {ChatInputCommandInteraction} interaction,
	 */
	async execute(interaction) {
		const { options } = interaction;
		const guildID = options.getString('serverid');
		const data = await GDB.findOne({ id: guildID });
		const embed = new EmbedBuilder().setColor('Blurple');

		if (!data)
			return interaction.reply({
				embeds: [embed.setDescription("🔹 | This guild isn't blacklisted.")],
				ephemeral: true,
			});

		await GDB.findOneAndUpdate(
			{
				id: guildID
			}, {
			$set: {
				blacklist: {
					isBlacklisted: false,
					reason: "",
					time: ""
				},
			},
		});

		return interaction.reply({
			embeds: [embed.setDescription('🔹 | This guild has been removed from the blacklist.')],
			ephemeral: true,
		});
	},
};
