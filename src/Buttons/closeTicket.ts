import {
	ButtonInteraction,
	EmbedBuilder,
	GuildMember,
	GuildMemberRoleManager,
	TextChannel,
} from 'discord.js';
import { createTranscript, ExportReturnType } from 'discord-html-transcripts';
import { Buttons } from '../interfaces/interfaces';
import { GuildDB as setupData } from '../structures/schemas/guild.js';
import { Tickets as ticketData } from '../structures/schemas/ticket.js';

const { Attachment } = ExportReturnType;

const button: Buttons = {
	id: 'closeTicket',
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
				embeds: [embed.setDescription('🔹 | This ticket is already closed.')],
				ephemeral: true,
			});

		await ticketData?.findOneAndUpdate(
			{
				ticketId: channel.id,
			},
			{
				closed: true,
				closer: definedMember.id,
			},
		);

		const attachment = await createTranscript(channel, {
			limit: -1,
			returnType: Attachment,
			filename: `Ticket - ${ticketsData?.creatorId}.html`,
		});

		const closedTime = Math.floor(new Date().getTime() / 1000);

		const fetchedChannel = guild.channels.cache.get(
			gTicketData?.tickets?.transcriptChannel,
		) as TextChannel;
		const message = await fetchedChannel.send({
			embeds: [
				embed.setTitle('Ticket Closed').addFields(
					{
						name: 'Opened by',
						value: `<@!${ticketsData?.creatorId}>`,
					},
					{
						name: 'Closed',
						value: `<t:${closedTime}:R>`,
					},
				),
			],
			files: [attachment],
		});

		interaction.reply({
			embeds: [
				embed.setDescription(
					`🔹 | The transcript of this ticket has been saved [here](${message.url}).`,
				),
			],
			ephemeral: true,
		});
		setTimeout(() => {
			channel.delete();
		}, 10 * 1000);
	},
};

export default button;
