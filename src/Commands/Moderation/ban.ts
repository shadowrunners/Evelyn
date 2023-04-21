import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	GuildMember,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from 'discord.js';
import { Command } from '../../interfaces/interfaces';
import { Evelyn } from '../../structures/Evelyn';

const { BanMembers } = PermissionFlagsBits;

const command: Command = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Bans a user.')
		.setDefaultMemberPermissions(BanMembers)
		.addUserOption((option) =>
			option
				.setName('target')
				.setDescription('Provide a target.')
				.setRequired(true),
		)
		.addStringOption((option) =>
			option.setName('reason').setDescription('Provide a reason.'),
		),
	execute(interaction: ChatInputCommandInteraction, client: Evelyn) {
		const { options, guild, member } = interaction;
		const defMember = member as GuildMember;
		const target = options.getMember('target') as GuildMember;
		const reason = options.getString('reason') || 'No reason specified.';
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		if (target.roles.highest.position >= defMember.roles.highest.position)
			return interaction.reply({
				embeds: [
					embed.setDescription(
						'🔹 | You can\'t ban someone with a role higher than yours.',
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
						'🔹 | I can\'t ban someone with a role higher than mine.',
					),
				],
				ephemeral: true,
			});

		target
			.send({
				embeds: [
					embed
						.setTitle(`${client.user.username} | Notice`)
						.setDescription(
							`You have been banned from ${guild.name} for ${reason}`,
						),
				],
			})
			.catch();

		return interaction
			.reply({
				embeds: [
					embed.setDescription(
						`${target.user.tag} has been banned for ${reason}.`,
					),
				],
			})
			.then(() => target.ban({ reason }));
	},
};

export default command;
