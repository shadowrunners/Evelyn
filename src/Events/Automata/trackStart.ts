import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	TextChannel,
} from 'discord.js';
import { Player, AutomataTrack } from '@shadowrunners/automata';
import { Util } from '../../Utils/Utils/Util.js';
import { Evelyn } from '../../Evelyn.js';

const { Primary } = ButtonStyle;

export default class TrackStart {
	name = 'trackStart';

	async execute(player: Player, track: AutomataTrack, client: Evelyn) {
		const utils = new Util();
		const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
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
			.setDescription(`**[${track.title}](${track.uri}) by ${track.author}**`)
			.setThumbnail(track.artworkUrl)
			.addFields(
				{
					name: 'Queued by',
					value: `${track.requester}`,
					inline: true,
				},
				{
					name: 'Duration',
					value: utils.formatTime(track.length),
					inline: true,
				},
			)
			.setTimestamp();

		const channel = client.channels.cache.get(
			player.textChannel,
		) as TextChannel;

		await channel
			.send({ embeds: [nowPlaying], components: [buttonRow] })
			.then((message) => player.setNowPlayingMessage(message));
	}
}
