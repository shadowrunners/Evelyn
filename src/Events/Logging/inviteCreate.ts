import { Event } from '../../interfaces/interfaces.js';
import { Invite, EmbedBuilder } from 'discord.js';
import { webhookDelivery } from '../../functions/webhookDelivery.js';
import { GuildDB as DB } from '../../structures/schemas/guild.js';

const event: Event = {
	name: 'inviteCreate',
	async execute(invite: Invite) {
		const {
			guild,
			createdTimestamp,
			expiresTimestamp,
			inviter,
			maxUses,
			code,
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
						value: `> <t:${createdTimestamp / 1000}:R>`,
					},
					{
						name: '🔹 | Invite expires at',
						value: `> <t:${expiresTimestamp / 1000}:R>`,
					},
					{
						name: '🔹 | Invite created by',
						value: `> ${inviter}`,
					},
					{
						name: '🔹 | Max Uses',
						value: `> ${maxUses.toString()}`,
					},
				)
				.setFooter({
					text: inviter.tag,
					iconURL: inviter.displayAvatarURL(),
				})
				.setTimestamp(),
		);
	},
};

export default event;
