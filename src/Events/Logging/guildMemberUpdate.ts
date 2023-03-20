import { Event } from '../../interfaces/interfaces.js';
import { GuildMember, EmbedBuilder } from 'discord.js';
import { webhookDelivery } from '../../functions/webhookDelivery.js';
import { GuildDB as DB } from '../../structures/schemas/guild.js';

const event: Event = {
	name: 'guildMemberUpdate',
	async execute(oldMember: GuildMember, newMember: GuildMember) {
		const { guild } = newMember;

		const data = await DB.findOne({
			id: oldMember.guild.id,
		});

		if (!data?.logs?.enabled || !data?.logs?.webhook) return;

		const oldRoles = oldMember.roles.cache.map((r) => r.id);
		const newRoles = newMember.roles.cache.map((r) => r.id);

		const embed = new EmbedBuilder().setColor('Blurple');

		if (oldRoles.length > newRoles.length) {
			const uniqueRoles = await unique(oldRoles, newRoles);
			const role = guild.roles.cache.get(uniqueRoles[0].toString());

			return webhookDelivery(
				'logs',
				data,
				embed
					.setAuthor({
						name: newMember.user.tag,
						iconURL: newMember.user.displayAvatarURL(),
					})
					.setTitle('Member Roles Updated')
					.addFields(
						{
							name: '🔹 | Member Username',
							value: `> ${oldMember.user.username}`,
						},
						{
							name: '🔹 | Member ID',
							value: `> ${oldMember.user.id}`,
						},
						{
							name: '🔹 | Removed Role',
							value: `> <@&${role.id}>`,
						},
					)
					.setTimestamp(),
			);
		}

		if (oldRoles.length < newRoles.length) {
			const uniqueRoles = unique(oldRoles, newRoles);
			const role = guild.roles.cache.get(uniqueRoles[0].toString());

			return webhookDelivery(
				'logs',
				data,
				embed
					.setAuthor({
						name: newMember.user.tag,
						iconURL: newMember.user.displayAvatarURL(),
					})
					.setTitle('Member Roles Updated')
					.addFields(
						{
							name: '🔹 | Member Username',
							value: `> ${oldMember.user.username}`,
						},
						{
							name: '🔹 | Member ID',
							value: `> ${oldMember.user.id}`,
						},
						{
							name: '🔹 | Added Role',
							value: `> <@&${role.id}>`,
						},
					)
					.setTimestamp(),
			);
		}

		if (
			!oldMember.isCommunicationDisabled() &&
			newMember.isCommunicationDisabled()
		)
			return webhookDelivery(
				'logs',
				data,
				embed
					.setAuthor({
						name: newMember.user.tag,
						iconURL: newMember.user.displayAvatarURL(),
					})
					.setTitle('Member Timeout Applied')
					.addFields(
						{
							name: '🔹 | Member Username',
							value: `> ${newMember.user.username}`,
						},
						{
							name: '🔹 | Member ID',
							value: `> ${newMember.user.id}`,
						},
						{
							name: '🔹 | Timeout expires',
							value: `> <t:${Math.floor(
								newMember.communicationDisabledUntilTimestamp / 1000,
							)}:R>`,
						},
					)
					.setTimestamp(),
			);

		if (
			oldMember.isCommunicationDisabled() &&
			!newMember.isCommunicationDisabled()
		)
			return webhookDelivery(
				'logs',
				data,
				embed
					.setAuthor({
						name: oldMember.user.tag,
						iconURL: oldMember.user.displayAvatarURL(),
					})
					.setTitle('Member Timeout Removed')
					.addFields(
						{
							name: '🔹 | Member Username',
							value: `> ${oldMember.user.username}`,
						},
						{
							name: '🔹 | Member ID',
							value: `> ${oldMember.user.id}`,
						},
						{
							name: '🔹 | Reason',
							value: '> Timeout expired!',
						},
					)
					.setTimestamp(),
			);

		if (oldMember.nickname !== newMember.nickname)
			return webhookDelivery(
				'logs',
				data,
				embed
					.setAuthor({
						name: newMember.user.tag,
						iconURL: newMember.user.displayAvatarURL(),
					})
					.setTitle('Member Nickname Changed')
					.addFields(
						{
							name: '🔹 | Username',
							value: `> ${newMember.user.username}`,
						},
						{
							name: '🔹 | ID',
							value: `> ${newMember.user.id}`,
						},
						{
							name: '🔹 | Old Nickname',
							value: `> ${oldMember.nickname}`,
						},
						{
							name: '🔹 | New Nickname',
							value: `> ${newMember.nickname}`,
						},
					)
					.setTimestamp(),
			);
	},
};

export default event;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unique(arr1: any[], arr2: any[]) {
	const unique1 = arr1.filter((z) => arr2.indexOf(z) === -1);
	const unique2 = arr2.filter((z) => arr1.indexOf(z) === -1);

	return unique1.concat(unique2);
}
