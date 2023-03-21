import {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	EmbedBuilder,
	ChannelType,
	Role,
} from 'discord.js';
import { Command } from '../../Interfaces/interfaces.js';

const command: Command = {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('Shows information about the current server.'),
	execute(interaction: ChatInputCommandInteraction) {
		const { guild } = interaction;
		const {
			createdTimestamp,
			ownerId,
			members,
			channels,
			emojis,
			stickers,
			roles,
		} = guild;
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		const sortedRoles = roles.cache
			.map((role) => role)
			.slice(1, roles.cache.size)
			.sort((a, b) => b.position - a.position);
		const userRoles = sortedRoles.filter((role) => !role.managed);
		const managedRoles = sortedRoles.filter((role) => role.managed);
		const botCount = members.cache.filter((member) => member.user.bot).size;

		// eslint-disable-next-line no-shadow
		const maxDisplayRoles = (roles: Role[], maxFieldLength = 1024) => {
			let totalLength = 0;
			const result = [];

			for (const role of roles) {
				const roleString = `<@&${role.id}>`;

				if (roleString.length + totalLength > maxFieldLength) break;

				totalLength += roleString.length + 1;
				result.push(roleString);
			}

			return result.length;
		};

		const getChannelTypeSize = (type: ChannelType[]) =>
			channels.cache.filter((channel) => type.includes(channel.type)).size;

		return interaction.reply({
			embeds: [
				embed
					.setTitle(`Information about ${guild.name}`)
					.addFields(
						{
							name: 'Description',
							value: `> ${guild.description || 'None.'}`,
						},
						{
							name: 'General',
							value: [
								`> **Name** ${guild.name}`,
								`> **ID** ${guild.id}`,
								`> **Created** <t:${createdTimestamp / 1000}:R>`,
								`> **Owner** <@${ownerId}>`,
								`> **Vanity URL** ${guild.vanityURLCode || 'None'}`,
							].join('\n'),
						},
						{
							name: 'Users',
							value: [
								`> **Members** ${guild.memberCount - botCount}`,
								`> **Bots** ${botCount}`,
							].join('\n'),
						},
						{
							name: 'User Roles',
							value: `> ${
								userRoles.slice(0, maxDisplayRoles(userRoles)).join(' ') ||
								'None'
							}`,
						},
						{
							name: 'Managed Roles',
							value: `> ${
								managedRoles
									.slice(0, maxDisplayRoles(managedRoles))
									.join(' ') || 'None'
							}`,
						},
						{
							name: 'Channels',
							value: [
								`> **Text** ${getChannelTypeSize([
									ChannelType.GuildText,
									ChannelType.GuildForum,
								])}`,
								`> **Voice** ${getChannelTypeSize([
									ChannelType.GuildVoice,
									ChannelType.GuildStageVoice,
								])}`,
							].join('\n'),
						},
						{
							name: 'Emojis and Stickers',
							value: [
								`> **Animated** ${emojis.cache.filter((e) => e.animated).size}`,
								`> **Static** ${emojis.cache.filter((e) => !e.animated).size}`,
								`> **Stickers** ${stickers.cache.size}`,
							].join('\n'),
						},
						{
							name: 'Nitro Stats',
							value: [
								`> **Tier** ${guild.premiumTier || 'None'}`,
								`> **Boosts** ${guild.premiumSubscriptionCount}`,
								`> **Boosters** ${
									guild.members.cache.filter(
										(member) => member.roles.premiumSubscriberRole,
									).size
								}`,
								`> **Total Boosters** ${
									guild.members.cache.filter((member) => member.premiumSince)
										.size
								}`,
							].join('\n'),
						},
					)
					.setThumbnail(guild.iconURL({ size: 1024 })),
			],
		});
	},
};

export default command;
