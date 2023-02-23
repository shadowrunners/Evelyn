const { webhookDelivery } = require('../../functions/webhookDelivery.js');
// eslint-disable-next-line no-unused-vars
const { GuildMember, EmbedBuilder } = require('discord.js');
const DB = require('../../structures/schemas/guild.js');

module.exports = {
	name: 'guildMemberRemove',
	/**
	 * @param {GuildMember} member
	 */
	async execute(member) {
		const { guild, user } = member;

		const data = await DB.findOne({
			id: guild.id,
		});

		if (!data?.logs?.enabled || !data?.logs?.webhook || user?.bot) return;

		const embed = new EmbedBuilder().setColor('Blurple');

		return webhookDelivery(
			'logs',
			data,
			embed
				.setAuthor({
					name: user.tag,
					iconURL: user.displayAvatarURL({ dynamic: true }),
				})
				.setTitle('Member Left')
				.addFields(
					{
						name: '🔹 | Member Name',
						value: `> ${user.tag}`,
					},
					{
						name: '🔹 | Member ID',
						value: `> ${user.id}`,
					},
					{
						name: '🔹 | Account Age',
						value: `> <t:${parseInt(user.createdTimestamp / 1000)}:R>`,
					},
				)
				.setFooter({ text: `${guild.name}` })
				.setTimestamp(),
		);
	},
};
