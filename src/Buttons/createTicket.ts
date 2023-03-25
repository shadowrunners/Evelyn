import {
	ButtonInteraction,
	ChannelType,
	PermissionsBitField,
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	TextChannel,
} from 'discord.js';

import { GuildDB as setupData } from '../structures/schemas/guild.js';
import { Tickets as ticketData } from '../structures/schemas/ticket.js';
import { Buttons } from '../Interfaces/interfaces.js';

const { SendMessages, ViewChannel, ReadMessageHistory } =
	PermissionsBitField.Flags;
const { PrivateThread } = ChannelType;

const button: Buttons = {
	botPermissions: [SendMessages, ViewChannel, ReadMessageHistory],
	id: 'createTicket',
	async execute(interaction: ButtonInteraction) {
		const { guild, member, user, channel } = interaction;
		const definedChannel = channel as TextChannel;
		const data = await setupData.findOne({ id: guild.id });
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		if (!data) return;

		const ticketsData = await ticketData.findOne({
			creatorId: user.id,
		});

		if (ticketsData?.creatorId && !ticketsData?.closed)
			return interaction.reply({
				embeds: [embed.setDescription('🔹 | You already have a ticket open.')],
				ephemeral: true,
			});

		const thread = await definedChannel.threads.create({
			name: `${user.username}-ticket`,
			type: PrivateThread,
			reason: 'User has requested a ticket.',
		});

		await ticketData.create({
			id: guild.id,
			ticketId: thread.id,
			closed: false,
			closer: null,
			creatorId: user.id,
		});

		thread.setRateLimitPerUser(2);

		const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId('closeTicket')
				.setLabel('Close')
				.setStyle(ButtonStyle.Danger)
				.setEmoji('⛔'),
			new ButtonBuilder()
				.setCustomId('claimTicket')
				.setLabel('Claim')
				.setStyle(ButtonStyle.Danger)
				.setEmoji('🛄'),
		);

		thread.send({
			content: `<@${user.id}>, your ticket lives here.`,
			embeds: [
				embed
					.setAuthor({
						name: `${guild.name} | Your Ticket`,
						iconURL: guild.iconURL(),
					})
					.setDescription(
						'Hiya! Please wait patiently while a staff member is coming to assist you with your issue. In the meantime, describe your issue as detailed as possible.',
					),
			],
			components: [buttons],
		});

		await interaction.reply({
			content: `${member}, your ticket has been created: ${channel}`,
			ephemeral: true,
		});
	},
};

export default button;
