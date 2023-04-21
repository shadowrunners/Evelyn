import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ApplicationCommandType,
	ContextMenuCommandBuilder,
	UserContextMenuCommandInteraction,
	ActivityType,
} from 'discord.js';
import { Util } from '../../Modules/Utils/utils.js';
import { ContextMenu } from '../../Interfaces/interfaces.js';
const { User } = ApplicationCommandType;

const command: ContextMenu = {
	botPermissions: ['SendMessages'],
	data: new ContextMenuCommandBuilder()
		.setName('User Information')
		.setType(User),
	async execute(interaction: UserContextMenuCommandInteraction) {
		const { guild, targetId } = interaction;
		const { convertToUnixTimestamp } = new Util();
		const target = await guild.members.fetch(targetId);
		const { user, presence, joinedTimestamp } = target;

		await user.fetch();

		const createdTime = convertToUnixTimestamp(user.createdTimestamp);
		const joinedTime = convertToUnixTimestamp(joinedTimestamp);
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

		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor('Blurple')
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
					)
					.setTimestamp(),
			],
			components: [actionRow],
			ephemeral: true,
		});
	},
};

export default command;
