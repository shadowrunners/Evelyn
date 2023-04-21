import { MusicUtils } from '../../../Modules/Utils/musicUtils.js';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Evelyn } from '../../../structures/Evelyn.js';
import { Subcommand } from '../../../interfaces/interfaces.js';
import { Client } from 'genius-lyrics';

const subCommand: Subcommand = {
	subCommand: 'music.lyrics',
	async execute(interaction: ChatInputCommandInteraction, client: Evelyn) {
		const { guildId } = interaction;
		const gClient = new Client(client.config.APIs.geniusKey);

		const embed = new EmbedBuilder().setColor('Blurple');
		const player = client.manager.players.get(guildId);
		const musicUtils = new MusicUtils(interaction, player);
		await interaction.deferReply();

		if (musicUtils.check(['voiceCheck', 'checkPlaying'])) return;

		const track = player.currentTrack.info;

		const trackTitle = track.title.replace(
			/(lyrics|lyric|lyrical|official music video|\(official music video\)|audio|official|official video|official video hd|official hd video|offical video music|\(offical video music\)|extended|hd|\[.+\])/gi,
			'',
		);
		const actualTrack = await gClient.songs.search(trackTitle);
		const searches = actualTrack[0];
		const lyrics = await searches.lyrics();

		return interaction.editReply({
			embeds: [
				embed
					.setAuthor({
						name: `🔹 | Lyrics for ${trackTitle}`,
						url: searches.url,
					})
					.setDescription(lyrics)
					.setFooter({ text: 'Lyrics are powered by Genius.' }),
			],
		});
	},
};

export default subCommand;
