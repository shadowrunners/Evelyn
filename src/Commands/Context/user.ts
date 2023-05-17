import { Discord, ContextMenu, ButtonComponent } from 'discordx';
import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ApplicationCommandType,
	UserContextMenuCommandInteraction,
	ActivityType,
	MessageContextMenuCommandInteraction,
	ButtonInteraction,
} from 'discord.js';
import { Util } from '../../Modules/Utils/utils.js';

@Discord()
export class UserInformation {
	private embed: EmbedBuilder;
	private util: Util;

	constructor() {
		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		this.util = new Util();
	}

	@ContextMenu({
		name: 'User Information',
		type: ApplicationCommandType.User,
	})
	async userHandler(
		interaction: UserContextMenuCommandInteraction,
	): Promise<void> {
		const { guild, targetId } = interaction;
		const target = await guild.members.fetch(targetId);
		const { user, presence, joinedTimestamp } = target;

		await user.fetch();

		const createdTime = this.util.convertToUnixTimestamp(user.createdTimestamp);
		const joinedTime = this.util.convertToUnixTimestamp(joinedTimestamp);
		const mappedActivities = presence?.activities?.map(
			(activity) => `${ActivityType[activity.type]} ${activity.name}`,
		);

		const actionRow = new ActionRowBuilder<ButtonBuilder>().setComponents(
			new ButtonBuilder()
				.setCustomId('avatar')
				.setLabel('Avatar')
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId('banner')
				.setLabel('Banner')
				.setStyle(ButtonStyle.Primary),
		);

		interaction.reply({
			embeds: [
				this.embed
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
								`> **Status** ${presence.status}`,
								`> **Current Activity** ${
									mappedActivities?.join(', ') ?? 'Nothing.'
								}`,
							].join('\n'),
						},
						{
							name: 'Roles',
							value:
								`> ${target.roles.cache
									.map((r) => r)
									.join(' ')
									.replace('@everyone', '')}` || 'None',
						},
					),
			],
			components: [actionRow],
			ephemeral: true,
		});

		return;
	}

	@ContextMenu({
		name: 'User Information',
		type: ApplicationCommandType.Message,
	})
	async messageHandler(
		interaction: MessageContextMenuCommandInteraction,
	): Promise<void> {
		const { guild, targetId } = interaction;
		const target = await guild.members.fetch(targetId);
		const { user, presence, joinedTimestamp } = target;

		await user.fetch();

		const createdTime = this.util.convertToUnixTimestamp(user.createdTimestamp);
		const joinedTime = this.util.convertToUnixTimestamp(joinedTimestamp);
		const mappedActivities = presence?.activities?.map(
			(activity) => `${ActivityType[activity.type]} ${activity.name}`,
		);

		const actionRow = new ActionRowBuilder<ButtonBuilder>().setComponents(
			new ButtonBuilder()
				.setCustomId('avatar')
				.setLabel('Avatar')
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId('banner')
				.setLabel('Banner')
				.setStyle(ButtonStyle.Primary),
		);

		interaction.reply({
			embeds: [
				this.embed
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
								`> **Status** ${presence.status}`,
								`> **Current Activity** ${
									mappedActivities?.join(', ') ?? 'Nothing.'
								}`,
							].join('\n'),
						},
						{
							name: 'Roles',
							value:
								`> ${target.roles.cache
									.map((r) => r)
									.join(' ')
									.replace('@everyone', '')}` || 'None',
						},
					),
			],
			components: [actionRow],
			ephemeral: true,
		});

		return;
	}

	@ButtonComponent({ id: 'avatar' })
	async avatarHandler(interaction: ButtonInteraction): Promise<void> {
		const { user } = interaction;
		await user.fetch();

		interaction.reply({
			embeds: [
				this.embed
					.setTitle(`${user.tag}'s Avatar`)
					.setImage(user.avatarURL({ size: 4096 }))
					.setURL(user.avatarURL({ size: 4096 })),
			],
			ephemeral: true,
		});

		return;
	}

	@ButtonComponent({ id: 'banner' })
	async bannerHandler(interaction: ButtonInteraction): Promise<void> {
		const { user } = interaction;
		await user.fetch();

		interaction.reply({
			embeds: [
				this.embed
					.setTitle(`${user.tag}'s Banner`)
					.setImage(user.bannerURL({ size: 4096 }))
					.setURL(user.bannerURL({ size: 4096 })),
			],
			ephemeral: true,
		});

		return;
	}
}
