import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	TextChannel,
} from 'discord.js';
import { Player, Track } from '@shadowrunners/automata';
import { Util } from '../../Modules/Utils/utils.js';
import { Evelyn } from '../../structures/Evelyn.js';
import { Event } from '../../interfaces/interfaces.js';

const { Primary } = ButtonStyle;

const event: Event = {
	name: 'playerStart',
	async execute(player: Player, track: Track, client: Evelyn) {
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
			.setDescription(`**[${track.info.title}](${track.info.uri})**`)
			.addFields(
				{
					name: 'Queued by',
					value: `${track.info.requester}`,
					inline: true,
				},
				{
					name: 'Duration',
					value: utils.formatTime(track.info.length),
					inline: true,
				},
			)
			.setThumbnail(track.info.image)
			.setTimestamp();

		const channel = client.channels.cache.get(
			player?.textChannel,
		) as TextChannel;
		await channel.send({ embeds: [nowPlaying], components: [buttonRow] });
	},
};

export default event;
