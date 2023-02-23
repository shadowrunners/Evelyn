const { webhookDelivery } = require('../../functions/webhookDelivery.js');
// eslint-disable-next-line no-unused-vars
const { GuildEmoji, EmbedBuilder, AuditLogEvent } = require('discord.js');
const DB = require('../../structures/schemas/guild.js');
const { EmojiDelete } = AuditLogEvent;

module.exports = {
	name: 'emojiDelete',
	/**
	 * @param {GuildEmoji} emoji
	 */
	async execute(emoji) {
		const { guild, name, id } = emoji;

		const data = await DB.findOne({
			id: guild.id,
		});

		if (!data?.logs?.enabled || !data?.logs?.webhook) return;

		const fetchLogs = await guild.fetchAuditLogs({
			type: EmojiDelete,
			limit: 1,
		});
		const firstLog = fetchLogs.entries.first();

		const embed = new EmbedBuilder().setColor('Blurple');

		return webhookDelivery(
			'logs',
			data,
			embed
				.setAuthor({
					name: guild.name,
					iconURL: guild.iconURL(),
				})
				.setTitle('Emoji Deleted')
				.addFields(
					{
						name: '🔹 | Name',
						value: `> ${name}`,
					},
					{
						name: '🔹 | ID',
						value: `> ${id}`,
					},
					{
						name: '🔹 | Removed by',
						value: `> <@${firstLog.executor.id}>`,
					},
				)
				.setTimestamp(),
		);
	},
};
