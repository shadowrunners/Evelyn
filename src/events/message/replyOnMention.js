const { Client, Message, EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'messageCreate',
	/**
	 * @param {Message} message
	 * @param {Client} client
	 */
	execute(message, client) {
		const { author, content } = message;
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);

		if (author?.bot) return;
		if (content.match(mention) && !author?.bot)
			return message.reply({
				embeds: [
					embed
						.setAuthor({
							name: 'Hiya!',
							iconURL: client.user.avatarURL({ dynamic: true }),
						})
						.setDescription(
							'Hiya, I\'m Evelyn! A multipurpose bot that gives you a paywall-free experience with no strings attached.\n\nTo access my commands, type `/` in the message box and select my profile picture from the sidebar on the left (if you\'re on PC) or at the bottom of your screen (if you\'re on mobile)!',
						)
						.setFooter({ text: 'Developed by scrappie#5451' }),
				],
			});
	},
};
