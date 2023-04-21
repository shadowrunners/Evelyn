import { MusicUtils } from '../../../Modules/Utils/musicUtils.js';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Evelyn } from '../../../structures/Evelyn.js';
import { Subcommand } from '../../../interfaces/interfaces.js';

const subCommand: Subcommand = {
	subCommand: 'music.nowplaying',
	async execute(interaction: ChatInputCommandInteraction, client: Evelyn) {
		const { user, guildId } = interaction;

		const player = client.manager.players.get(guildId);
		const musicUtils = new MusicUtils(interaction, player);
		const embed = new EmbedBuilder().setColor('Blurple');

		await interaction.deferReply();

		if (musicUtils.check(['voiceCheck', 'checkPlaying'])) return;
		const track = player.currentTrack.info;

		return interaction.editReply({
			embeds: [
				embed
					.setAuthor({
						name: 'Now Playing',
						iconURL: user.avatarURL(),
					})
					.setDescription(
						`**[${track.title}](${track.uri})** [${track.requester}]`,
					),
			],
		});
	},
};

export default subCommand;
