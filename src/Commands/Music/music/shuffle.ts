import { MusicUtils } from '../../../Modules/Utils/musicUtils.js';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Evelyn } from '../../../structures/Evelyn.js';
import { Subcommand } from '../../../interfaces/interfaces.js';

const subCommand: Subcommand = {
	subCommand: 'music.shuffle',
	async execute(interaction: ChatInputCommandInteraction, client: Evelyn) {
		const { guildId } = interaction;

		const embed = new EmbedBuilder().setColor('Blurple');
		const player = client.manager.players.get(guildId);
		const musicUtils = new MusicUtils(interaction, player);
		await interaction.deferReply();

		if (musicUtils.check(['voiceCheck', 'checkQueue'])) return;

		player.queue.shuffle();

		return interaction.editReply({
			embeds: [embed.setDescription('🔹 | Shuffled.')],
		});
	},
};

export default subCommand;
