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
export class Ban {
	@Slash({
		name: 'ban',
		description: 'Bans a user.',
		defaultMemberPermissions: PermissionFlagsBits.BanMembers,
	})
	async ban(
		@SlashOption({
			name: 'target',
			description: 'Provide a target.',
			type: ApplicationCommandOptionType.User,
			required: true,
		})
		@SlashOption({
			name: 'reason',
			description: 'Provide a reason.',
			type: ApplicationCommandOptionType.String,
			required: false,
		})
			target: GuildMember,
			reason: string,
			interaction: ExtendedChatInteraction,
			client: Evelyn,
	) {
		const { guild, member } = interaction;
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		if (target.roles.highest.position >= member.roles.highest.position)
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
							`You have been banned from ${guild.name} for ${
								reason || 'no reason specified.'
							}`,
						),
				],
			})
			.catch();

		await interaction.reply({
			embeds: [
				embed.setDescription(
					`${target.user.tag} has been banned for ${
						reason || 'no reason specified.'
					}.`,
				),
			],
		});
		return await target.ban({ reason: reason || 'No reason specified.' });
	}
}
