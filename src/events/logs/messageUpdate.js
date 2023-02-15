const { webhookDelivery } = require('../../functions/webhookDelivery.js');
const DB = require('../../structures/schemas/guild.js');
// eslint-disable-next-line no-unused-vars
const { Message, EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'messageUpdate',
	/**
	 * @param {Message} oldMessage
	 * @param {Message} newMessage
	 */
	async execute(oldMessage, newMessage) {
		const data = await DB.findOne({
			id: oldMessage.guild.id,
		});

		if (!data.logs.enabled || !data.logs.webhook || oldMessage.author?.bot)
			return;

		const embed = new EmbedBuilder().setColor('Blurple');

		if (oldMessage.content !== newMessage.content)
			return webhookDelivery(
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
							value: `> <t:${parseInt(newMessage.createdTimestamp / 1000)}:R>`,
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
