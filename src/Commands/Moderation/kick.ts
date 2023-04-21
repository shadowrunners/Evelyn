import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	GuildMember,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from 'discord.js';
import { Command } from '../../interfaces/interfaces';
import { Evelyn } from '../../structures/Evelyn';

const { KickMembers } = PermissionFlagsBits;

const command: Command = {
	data: new SlashCommandBuilder()
		.setName('lock')
		.setDescription('Locks a channel.')
		.setDefaultMemberPermissions(KickMembers)
		.addUserOption((options) =>
			options
				.setName('target')
				.setDescription('Provide a target.')
				.setRequired(true),
		)
		.addStringOption((options) =>
			options.setName('reason').setDescription('Provide a reason for the kick.'),
		),
	execute(interaction: ChatInputCommandInteraction, client: Evelyn) {
		const { user } = client;
		const { options, member, guild } = interaction;
		const defMember = member as GuildMember;
		const target = options.getMember('target') as GuildMember;
		const reason = options.getString('reason') || 'No reason specified.';
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		if (target.roles.highest.position >= defMember.roles.highest.position)
			return interaction.reply({
				embeds: [
					embed.setDescription(
						'🔹 | You can\'t kick someone with a role higher than yours.',
					),
				],
				ephemeral: true,
			});

		if (
			target.roles.highest.position >= guild.members.me.roles.highest.position
		)
			return interaction.reply({
				embeds: [
					embed.setDescription(
						'🔹 | I can\'t kick someone with a role higher than mine.',
					),
				],
				ephemeral: true,
			});

		target
			.send({
				embeds: [
					embed
						.setTitle(`${user.username} | Notice`)
						.setDescription(
							`You have been kicked from ${guild.name} for ${reason}`,
						),
				],
			})
			.catch();

		interaction.reply({
			embeds: [
				embed.setDescription(
					`${target.user.tag} has been kicked for ${reason}.`,
				),
			],
		});
		return target.kick(reason);
	},
};

export default command;
