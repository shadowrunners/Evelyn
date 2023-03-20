import { Evelyn } from '../../structures/Evelyn';
import { Message, EmbedBuilder } from 'discord.js';
import { Event } from '../../interfaces/interfaces.js';

const event: Event = {
	name: 'messageCreate',
	execute(message: Message, client: Evelyn) {
		const { author, content } = message;
		const { user } = client;
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		const mention = new RegExp(`^<@!?${user.id}>( |)$`);

		if (author?.bot) return;
		if (content.match(mention) && !author?.bot)
			return message.reply({
				embeds: [
					embed
						.setAuthor({
							name: 'Hiya!',
							iconURL: user.avatarURL(),
						})
						.setDescription(
							'Hiya, I\'m Evelyn! A multipurpose bot that gives you a paywall-free experience with no strings attached.\n\nTo access my commands, type `/` in the message box and select my profile picture from the sidebar on the left (if you\'re on PC) or at the bottom of your screen (if you\'re on mobile)!',
						)
						.setFooter({ text: 'Developed by scrappie#5451' }),
				],
			});
	},
};

export default event;
