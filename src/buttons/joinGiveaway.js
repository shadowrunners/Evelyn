// eslint-disable-next-line no-unused-vars
const { ButtonInteraction, EmbedBuilder } = require('discord.js');
const DB = require('../structures/schemas/giveaway.js');

module.exports = {
	id: 'joinGiveaway',
	/**
	 * @param {ButtonInteraction} interaction
	 */
	async execute(interaction) {
		const { guild, channel, message, user } = interaction;

		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		const data = await DB.findOne({
			guildId: guild.id,
			channelId: channel.id,
			messageId: message.id,
		});

		if (!data) {
			embed.setDescription('🔹 | There is no data in the database.');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if (data.enteredUsers.includes(user.id)) {
			embed.setDescription('🔹 | You have already joined the giveaway.');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if (data.isPaused === true) {
			embed.setDescription('🔹 | This giveaway is currently paused.');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if (data.hasEnded === true) {
			embed.setDescription('🔹 | Unfortunately, this giveaway has ended.');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		await DB.findOneAndUpdate(
			{
				guildId: guild.id,
				channelId: channel.id,
				messageId: message.id,
			},
			{
				$push: { enteredUsers: user.id },
			},
		).then(() => {
			embed.setDescription('🔹 | Your entry has been confirmed. Good luck!');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		});
	},
};
