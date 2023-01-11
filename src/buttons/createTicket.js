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

		if (ticketsData.creatorId && !ticketsData.closed) {
			return interaction.reply({
				embeds: [embed.setDescription('🔹 | You already have a ticket open.')],
				ephemeral: true,
			});
		}

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

		await ticketData.findOneAndUpdate(
			{ id: guild.id },
			{
				$set: {
					ticketId: channel.id,
					claimed: false,
					closed: false,
					deleted: false,
					creatorId: user.id,
					claimer: null,
				},
			},
		);

		channel.setRateLimitPerUser(2);

		const buttons = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('closeTicket')
				.setLabel('Close')
				.setStyle(ButtonStyle.Success)
				.setEmoji('⛔'),
			new ButtonBuilder()
				.setCustomId('claimTicket')
				.setLabel('Claim')
				.setStyle(ButtonStyle.Success)
				.setEmoji('🛄'),
		);

		channel.send({
			content: `<@&${data.tickets?.ticketHandlers}>`,
			embeds: [
				embed
					.setAuthor({
						name: `${guild.name} | Your Ticket`,
						iconURL: guild.iconURL({ dynamic: true }),
					})
					.setDescription(
						`Hiya, <@${user.id}>! Please wait patiently while a staff member is coming to assist you with your issue. In the meantime, describe your issue as detailed as possible.`,
					),
			],
			components: [buttons],
		});

		await channel
			.send({
				content: `${member}, your ticket has been created: ${channel}`,
			})
			.then((m) => {
				setTimeout(() => {
					m.delete().catch();
				}, 5 * 1000);
			});

		await interaction.reply({
			content: `${member}, your ticket has been created: ${channel}`,
			ephemeral: true,
		});
	},
};
