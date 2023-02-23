const {
	// eslint-disable-next-line no-unused-vars
	Client,
	// eslint-disable-next-line no-unused-vars
	ChatInputCommandInteraction,
	ActionRowBuilder,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require('discord.js');
const { Primary } = ButtonStyle;
const { endGiveaway } = require('../../../functions/giveawayUtils.js');
const DB = require('../../../structures/schemas/giveaway.js');
const ms = require('ms');

module.exports = {
	subCommand: 'giveaway.create',
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		const { options, channelId, user, guild } = interaction;

		const channel = options.getChannel('channel') || channelId;
		const duration = options.getString('duration');
		const winnerCount = options.getInteger('winners');
		const prize = options.getString('prize');

		const actionRow = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('joinGiveaway')
				.setLabel('Join')
				.setEmoji('🎉')
				.setStyle(Primary),
		);

		const embed = new EmbedBuilder()
			.setColor('Blurple')
			.setTitle(prize)
			.addFields(
				{
					name: 'Hosted by',
					value: `${user}`,
					inline: true,
				},
				{
					name: 'Time Remaining',
					value: `<t:${parseInt((Date.now() + ms(duration)) / 1000)}:R>`,
					inline: true,
				},
			)
			.setFooter({ text: `${winnerCount} winner(s)` })
			.setTimestamp();

		const message = await client.channels.cache
			.get(channel)
			.send({ embeds: [embed], components: [actionRow] });

		interaction.reply({ content: '🔹 | Giveaway created.', ephemeral: true });

		await DB.create({
			guildId: guild.id,
			channelId: channel,
			messageId: message.id,
			winners: winnerCount,
			endTime: parseInt((Date.now() + ms(duration)) / 1000),
			prize: prize,
			isPaused: false,
			hasEnded: false,
			hoster: user.id,
		}).then((data) => {
			setTimeout(async () => {
				if (!data.hasEnded) await endGiveaway(message);
			}, ms(duration));
		});
	},
};
