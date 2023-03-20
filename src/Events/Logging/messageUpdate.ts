import { Event } from '../../interfaces/interfaces.js';
import { Message, EmbedBuilder } from 'discord.js';
import { webhookDelivery } from '../../functions/webhookDelivery.js';
import { GuildDB as DB } from '../../structures/schemas/guild.js';

const event: Event = {
	name: 'messageUpdate',
	async execute(oldMessage: Message, newMessage: Message) {
		const data = await DB.findOne({
			id: oldMessage.guild.id,
		});

		if (!data?.logs?.enabled || !data?.logs?.webhook || oldMessage.author?.bot)
			return;

		const embed = new EmbedBuilder().setColor('Blurple');

		if (oldMessage.content !== newMessage.content)
			return webhookDelivery(
				'logs',
				data,
				embed
					.setAuthor({
						name: oldMessage.guild.name,
						iconURL: oldMessage.guild.iconURL(),
					})
					.setTitle('Message Updated')
					.addFields(
						{
							name: '🔹 | Old Content',
							value: `> ${oldMessage.content}`,
						},
						{
							name: '🔹 | New Content',
							value: `> ${newMessage.content}`,
						},
						{
							name: '🔹 | ID',
							value: `> ${oldMessage.id}`,
						},
						{
							name: '🔹 | Message updated by',
							value: `> ${newMessage.author}`,
						},
						{
							name: '🔹 | Updated at',
							value: `> <t:${newMessage.createdTimestamp / 1000}:R>`,
						},
						{
							name: '🔹 | Wanna see the message?',
							value: `> [Jump to Message](${newMessage.url})`,
						},
					)
					.setTimestamp(),
			);
	},
};

export default event;
