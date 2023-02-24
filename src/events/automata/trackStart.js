const client = require('../../structures/index.js');
const {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require('discord.js');
const { Primary } = ButtonStyle;
// eslint-disable-next-line no-unused-vars
const { Player, AutomataTrack } = require('@lustlabs/automata');
const pms = require('pretty-ms');

module.exports = {
	name: 'trackStart',
	/**
	 * @param {Player} player
	 * @param {AutomataTrack} track
	 */
	async execute(player, track) {
		const buttonRow = new ActionRowBuilder().addComponents(
			new ButtonBuilder().setCustomId('pause').setLabel('⏯️').setStyle(Primary),
			new ButtonBuilder().setCustomId('skip').setLabel('⏭️').setStyle(Primary),
			new ButtonBuilder().setCustomId('volup').setLabel('🔊').setStyle(Primary),
			new ButtonBuilder()
				.setCustomId('voldown')
				.setLabel('🔉')
				.setStyle(Primary),
			new ButtonBuilder()
				.setCustomId('shuffle')
				.setLabel('🔀')
				.setStyle(Primary),
		);

		const nowPlaying = new EmbedBuilder()
			.setColor('Blurple')
			.setTitle('🎧 Started Playing')
			.setDescription(`**[${track.info.title}](${track.info.uri})**`)
			.addFields(
				{
					name: 'Queued by',
					value: `<@${track.info.requester.id}>`,
					inline: true,
				},
				{ name: 'Duration', value: pms(track.info.length), inline: true },
			)
			.setThumbnail(track.info.thumbnail)
			.setTimestamp();

		await client.channels.cache
			.get(player.textChannel)
			.send({ embeds: [nowPlaying], components: [buttonRow] });
	},
};
