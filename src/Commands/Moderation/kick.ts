import {
	ApplicationCommandOptionType,
	PermissionFlagsBits,
	EmbedBuilder,
	GuildMember,
} from 'discord.js';
import type { ExtendedChatInteraction } from '../../Interfaces/Interfaces.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { Evelyn } from '../../Evelyn.js';

@Discord()
export class Kick {
	@Slash({
		name: 'kick',
		description: 'Kicks a user.',
		defaultMemberPermissions: PermissionFlagsBits.KickMembers,
	})
	async lock(
		@SlashOption({
			name: 'target',
			description: 'Provide a target.',
			type: ApplicationCommandOptionType.User,
			required: true,
		})
		@SlashOption({
			name: 'reason',
			description: 'Provide a reason for the kick.',
			type: ApplicationCommandOptionType.String,
			required: false,
		})
			target: GuildMember,
			reason: string,
			interaction: ExtendedChatInteraction,
			client: Evelyn,
	) {
		const { user } = client;
		const { member, guild } = interaction;
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		if (target.roles.highest.position >= member.roles.highest.position)
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
							`You have been kicked from ${guild.name} for ${
								reason || 'no reason specified.'
							}`,
						),
				],
			})
			.catch();

		interaction.reply({
			embeds: [
				embed.setDescription(
					`${target.user.tag} has been kicked for ${
						reason || 'no reason specified.'
					}.`,
				),
			],
		});
		return target.kick(reason || 'no reason specified.');
	}
}
