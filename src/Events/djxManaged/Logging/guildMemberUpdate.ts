import { dropOffLogs, validate } from '../../../Utils/Utils/dropOffLogs.js';
import { EmbedBuilder, GuildMember } from 'discord.js';
import { Evelyn } from '../../../Evelyn.js';
import { Discord, On } from 'discordx';

@Discord()
export class GuildMemberUpdate {
	@On({ event: 'guildMemberUpdate' })
	async guildMemberUpdate([members]: [GuildMember], client: Evelyn) {
		const oldMember = members[0] as GuildMember;
		const newMember = members[1] as GuildMember;

		const { guild } = newMember;

		if (!(await validate(guild))) return;

		const oldRoles = oldMember.roles.cache.map((r) => r.id);
		const newRoles = newMember.roles.cache.map((r) => r.id);

		const embed = new EmbedBuilder().setColor('Blurple');

		if (oldRoles.length > newRoles.length) {
			const uniqueRoles = unique(oldRoles, newRoles);
			const role = guild.roles.cache.get(uniqueRoles[0].toString());

			return dropOffLogs(
				guild,
				client,
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

			return dropOffLogs(
				guild,
				client,
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
			return dropOffLogs(
				guild,
				client,
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
			return dropOffLogs(
				guild,
				client,
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
			return dropOffLogs(
				guild,
				client,
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
	}
}

function unique(arr1: string[], arr2: string[]) {
	const unique1 = arr1.filter((z) => arr2.indexOf(z) === -1);
	const unique2 = arr2.filter((z) => arr1.indexOf(z) === -1);

	return unique1.concat(unique2);
}
