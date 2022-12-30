// eslint-disable-next-line no-unused-vars
const { ButtonInteraction, EmbedBuilder } = require('discord.js');
const { createTranscript } = require('discord-html-transcripts');
const setupData = require('../structures/schemas/guild.js');
const ticketData = require('../structures/schemas/ticket.js');

module.exports = {
	id: 'closeTicket',
	/**
	 * @param {ButtonInteraction} interaction
	 */
	async execute(interaction) {
		const { guild, member, channel } = interaction;
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		const gTicketData = await setupData.findOne({ id: guild.id });

		if (
			!member.roles.cache.find(
				(r) => r.id === gTicketData.tickets.ticketHandlers,
			)
		) {
			return interaction.reply({
				embeds: [
					embed.setDescription(
						'🔹 | Only the support team can use these buttons.',
					),
				],
				ephemeral: true,
			});
		}

		const ticketsData = await ticketData.findOne({
			id: guild.id,
			ticketId: channel.id,
		});

		if (ticketsData.closed === true) {
			return interaction.reply({
				embeds: [embed.setDescription('🔹 | This ticket is already closed.')],
			});
		}

		if (!ticketsData.closer === member.id) {
			return interaction.reply({
				embeds: [
					embed.setDescription(
						'🔹 | You are not the user that closed this ticket!',
					),
				],
				ephemeral: true,
			});
		}

		await ticketData.findOneAndUpdate(
			{
				ticketId: channel.id,
			},
			{
				closed: true,
				closer: member.id,
			},
		);

		const attachment = await createTranscript(channel, {
			limit: -1,
			returnType: 'attachment',
			fileName: `Ticket - ${ticketsData.creatorId}.html`,
		});

		const closedTime = Math.floor(new Date().getTime() / 1000);

		const message = await guild.channels.cache
			.get(gTicketData.tickets.transcriptChannel)
			.send({
				embeds: [
					embed.setTitle('Ticket Closed').addFields(
						{ name: 'Opened by', value: `<@!${ticketsData.creatorId}>` },
						{
							name: 'Claimed by',
							value: `<@${ticketsData.claimer}>` || 'No one.',
						},
						{ name: 'Closed', value: `<t:${closedTime}:R>` },
					),
				],
				files: [attachment],
			});

		interaction.reply({
			embeds: [
				embed.setDescription(
					`🔹 | Transcript saved: [transcripthere](${message.url}).`,
				),
			],
		});
		setTimeout(() => {
			channel.delete();
		}, 10 * 1000);
	},
};
