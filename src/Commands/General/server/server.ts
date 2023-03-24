import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	Guild,
	ChannelType,
} from 'discord.js';
import { Subcommand } from '../../../Interfaces/interfaces.js';
import { convertToUnixTimestamp } from '../../../Functions/convert2Unix.js';

const subCommand: Subcommand = {
	subCommand: 'server.roles',
	execute(interaction: ChatInputCommandInteraction) {
		const { guild } = interaction;
		const definedGuild = guild as Guild;
		const {
			name,
			description,
			id,
			createdTimestamp,
			ownerId,
			members,
			channels,
			emojis,
			stickers,
			vanityURLCode,
			memberCount,
			premiumTier,
			premiumSubscriptionCount,
			iconURL,
		} = definedGuild;
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		const botCount = members.cache.filter((member) => member.user.bot).size;
		const getChannelTypeSize = (type: ChannelType[]) =>
			channels.cache.filter((channel) => type.includes(channel.type)).size;
		const createdTime = convertToUnixTimestamp(createdTimestamp);

		return interaction.reply({
			embeds: [
				embed
					.setTitle(`Information about ${name}`)
					.addFields(
						{
							name: 'Description',
							value: `> ${description || 'None.'}`,
						},
						{
							name: 'General',
							value: [
								`> **Name** ${name}`,
								`> **ID** ${id}`,
								`> **Created** <t:${createdTime}:R>`,
								`> **Owner** <@${ownerId}>`,
								`> **Vanity URL** ${vanityURLCode || 'None'}`,
							].join('\n'),
						},
						{
							name: 'Users',
							value: [
								`> **Members** ${memberCount - botCount}`,
								`> **Bots** ${botCount}`,
							].join('\n'),
						},
						{
							name: 'Roles',
							value: '> You can see all the roles by using /server roles.',
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
								`> **Tier** ${premiumTier || 'None'}`,
								`> **Boosts** ${premiumSubscriptionCount}`,
								`> **Boosters** ${
									members.cache.filter(
										(member) => member.roles.premiumSubscriberRole,
									).size
								}`,
								`> **Total Boosters** ${
									members.cache.filter((member) => member.premiumSince).size
								}`,
							].join('\n'),
						},
					)
					.setThumbnail(iconURL({ size: 1024 })),
			],
		});
	},
};

export default subCommand;
