import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	ActivityType,
	GuildMember,
} from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { Util } from '../../Utils/Utils/Util.js';

@Discord()
export class UserInfo {
	@Slash({
		name: 'userinfo',
		description: 'Shows information about a user.',
	})
	userinfo(
		@SlashOption({
			name: 'target',
			description: 'Provide a target.',
			type: ApplicationCommandOptionType.User,
			required: false,
		})
			target: GuildMember,
			interaction: ChatInputCommandInteraction,
	) {
		const { convertToUnixTimestamp, capitalizePresence } = new Util();
		const typedMember = target || interaction.member;
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		const { joinedTimestamp, presence, user, roles } =
			typedMember as GuildMember;
		const status = capitalizePresence(presence.status);

		const createdTime = convertToUnixTimestamp(user.createdTimestamp);
		const joinedTime = convertToUnixTimestamp(joinedTimestamp);
		const mappedActivities = presence?.activities?.map(
			(activity) => `${ActivityType[activity.type]} ${activity.name}`,
		);

		return interaction.reply({
			embeds: [
				embed
					.setAuthor({
						name: `${user.tag}`,
						iconURL: `${user.avatarURL()}`,
					})
					.setThumbnail(user.avatarURL())
					.setImage(user.bannerURL({ size: 512 }) || null)
					.addFields(
						{
							name: 'General',
							value: [
								`> **Name** ${user.username}`,
								`> **ID** ${user.id}`,
								`> **Discriminator** #${user.discriminator}`,
								`> **Discord member since** <t:${createdTime}:R>`,
								`> **Server member since** <t:${joinedTime}:R>`,
							].join('\n'),
						},
						{
							name: 'Activity',
							value: [
								`> **Status** ${status}`,
								`> **Current Activity** ${
									mappedActivities?.join(', ') ?? 'Nothing.'
								}`,
							].join('\n'),
						},
						{
							name: 'Roles',
							value:
								`> ${roles.cache
									.map((r) => r)
									.join(' ')
									.replace('@everyone', '')}` || 'None',
						},
					),
			],
		});
	}
}
