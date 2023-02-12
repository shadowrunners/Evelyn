const {
	// eslint-disable-next-line no-unused-vars
	ChatInputCommandInteraction,
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require('discord.js');
const GDB = require('../../../structures/schemas/guild.js');
const { Primary } = ButtonStyle;

module.exports = {
	subCommand: 'tickets.send-panel',
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		const { options, guildId } = interaction;
		const channel = options.getChannel('channel');
		const data = await GDB.findOne({ id: guildId });

		const nEmbed = new EmbedBuilder().setColor('Blurple');

		const embed = data.tickets.embed;
		const ticketEmbed = new EmbedBuilder();

		if (embed.color) {
			const hexCodeRegex = /^#[0-9A-Fa-f]{6}$/;
			if (hexCodeRegex.test(embed.color)) ticketEmbed.setColor(embed.color);
		}

		if (embed.title) ticketEmbed.setTitle(embed.title);

		if (embed.description)
			ticketEmbed.setDescription(embed.description || 'Undefined');

		if (embed.author)
			ticketEmbed.setAuthor({
				name: embed.author.name,
				iconURL: embed.author.icon_url,
			});

		if (embed.footer)
			ticketEmbed.setFooter({
				text: embed.footer.text || 'Undefined',
				iconURL: embed.footer.icon_url,
			});

		if (embed.image?.url) ticketEmbed.setImage(embed.image?.url);
		if (embed.thumbnail?.url) ticketEmbed.setThumbnail(embed.thumbnail.url);

		const buttons = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('createTicket')
				.setLabel('Open a Ticket')
				.setEmoji('📩')
				.setStyle(Primary),
		);

		channel.send({
			embeds: [ticketEmbed],
			components: [buttons],
		});

		return interaction.reply({
			embeds: [
				nEmbed.setDescription(
					`🔹 | The ticket panel has been sent in: <#${channel.id}>.`,
				),
			],
			ephemeral: true,
		});
	},
};
