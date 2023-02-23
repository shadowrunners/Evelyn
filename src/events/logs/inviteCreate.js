const { webhookDelivery } = require('../../functions/webhookDelivery.js');
// eslint-disable-next-line no-unused-vars
const { Invite, EmbedBuilder } = require('discord.js');
const DB = require('../../structures/schemas/guild.js');

module.exports = {
	name: 'inviteCreate',
	/**
	 * @param {Invite} invite
	 */
	async execute(invite) {
		const {
			guild,
			code,
			createdTimestamp,
			inviter,
			maxUses,
			expiresTimestamp,
		} = invite;

		const data = await DB.findOne({
			id: guild.id,
		});

		if (!data?.logs?.enabled || !data?.logs?.webhook) return;

		const embed = new EmbedBuilder().setColor('Blurple');

		return webhookDelivery(
			'logs',
			data,
			embed
				.setAuthor({
					name: guild.name,
					iconURL: guild.iconURL(),
				})
				.setTitle('Invite Created')
				.addFields(
					{
						name: '🔹 | Invite Link',
						value: `> https://discord.gg/${code}`,
					},
					{
						name: '🔹 | Invite created at',
						value: `> <t:${parseInt(createdTimestamp / 1000)}:R>`,
					},
					{
						name: '🔹 | Invite expires at',
						value: `> <t:${parseInt(expiresTimestamp / 1000)}:R>`,
					},
					{
						name: '🔹 | Invite created by',
						value: `> <@${inviter.id}>`,
					},
					{
						name: '🔹 | Max Uses',
						value: `> ${maxUses.toString()}`,
					},
				)
				.setFooter({
					text: inviter.tag,
					iconURL: inviter.displayAvatarURL({ dynamic: true }),
				})
				.setTimestamp(),
		);
	},
};
