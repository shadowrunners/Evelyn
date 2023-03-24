import {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	EmbedBuilder,
	GuildMember,
	ActivityType,
} from 'discord.js';
import { Command } from '../../Interfaces/interfaces.js';
import { Util } from '../../Modules/Utils/utils.js';

const command: Command = {
	botPermissions: ['SendMessages'],
	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('Shows information about a user.')
		.addUserOption((options) =>
			options
				.setName('target')
				.setDescription('Provide a target.')
				.setRequired(false),
		),
	execute(interaction: ChatInputCommandInteraction) {
		const { convertToUnixTimestamp, capitalizePresence } = new Util();
		const { options, member } = interaction;
		const target = options.getUser('target') || member;
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		const { joinedTimestamp, presence, user, roles } = target as GuildMember;
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
	},
};

export default command;
