import {
	ButtonInteraction,
	EmbedBuilder,
	GuildMember,
	GuildMemberRoleManager,
} from 'discord.js';
import { Buttons } from '../interfaces/interfaces';
import { GuildDB as setupData } from '../structures/schemas/guild.js';
import { Tickets as ticketData } from '../structures/schemas/ticket.js';

const button: Buttons = {
	id: 'claimTicket',
	async execute(interaction: ButtonInteraction) {
		const { guild, member, channel } = interaction;
		const gTicketData = await setupData.findOne({ id: guild.id });
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		const definedMember = member as GuildMember;
		const memberRoles = member.roles as GuildMemberRoleManager;

		if (
			!memberRoles.cache.find(
				(r) => r.id === gTicketData.tickets?.assistantRole,
			)
		)
			return interaction.reply({
				embeds: [
					embed.setDescription(
						'🔹 | Only the support team can use these buttons.',
					),
				],
				ephemeral: true,
			});

		const ticketsData = await ticketData.findOne({
			id: guild.id,
			ticketId: channel.id,
		});

		if (ticketsData?.closed === true)
			return interaction.reply({
				embeds: [
					embed.setDescription(
						'🔹 | This ticket has been closed. This action can no longer be performed.',
					),
				],
				ephemeral: true,
			});

		if (
			ticketsData?.claimed === true &&
			ticketsData?.claimer !== definedMember.user.id
		)
			return interaction.reply({
				embeds: [
					embed.setDescription(
						`'🔹 | This ticket has already been claimed by <@${ticketsData.claimer}>.`,
					),
				],
				ephemeral: true,
			});

		await ticketData?.findOneAndUpdate(
			{
				ticketId: channel.id,
			},
			{
				claimed: true,
				claimer: definedMember.id,
			},
		);

		interaction.reply({
			embeds: [
				embed.setDescription('🔹 | You have successfully claimed this ticket.'),
			],
			ephemeral: true,
		});
	},
};

export default button;
