const {
	// eslint-disable-next-line no-unused-vars
	ButtonInteraction,
	ChannelType,
	PermissionsBitField,
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require('discord.js');
const { GuildText } = ChannelType;
const { SendMessages, ViewChannel, ReadMessageHistory } =
	PermissionsBitField.Flags;
const setupData = require('../structures/schemas/guild.js');
const ticketData = require('../structures/schemas/ticket.js');

module.exports = {
	id: 'createTicket',
	/**
	 * @param {ButtonInteraction} interaction
	 */
	async execute(interaction) {
		const { guild, member, user } = interaction;
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

		const channel = await guild.channels.create({
			name: `${user.username}-ticket`,
			type: GuildText,
			parent: data.tickets.category,
			permissionOverwrites: [
				{
					id: member.id,
					allow: [SendMessages, ViewChannel, ReadMessageHistory],
				},
				{
					id: guild.roles.everyone.id,
					deny: [SendMessages, ViewChannel, ReadMessageHistory],
				},
			],
		});

		await ticketData.create({
			id: guild.id,
			ticketId: channel.id,
			closed: false,
			closer: null,
			creatorId: user.id,
		});

		channel.setRateLimitPerUser(2);

		const buttons = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('closeTicket')
				.setLabel('Close')
				.setStyle(ButtonStyle.Danger)
				.setEmoji('⛔'),
		);

		channel.send({
			content: `<@${user.id}>, your ticket lives here.`,
			embeds: [
				embed
					.setAuthor({
						name: `${guild.name} | Your Ticket`,
						iconURL: guild.iconURL({ dynamic: true }),
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
