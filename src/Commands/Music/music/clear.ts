import { EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Evelyn } from '../../../structures/Evelyn';
import { Subcommand } from '../../../interfaces/interfaces';

const subCommand: Subcommand = {
	subCommand: "music.clear",
	async execute(interaction: ChatInputCommandInteraction, client: Evelyn) {
        const { guildId } = interaction;

		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		const player = client.manager.players.get(guildId);
		//const musicUtils = new MusicUtils(interaction, player);

		await interaction.deferReply();

		//if (musicUtils.voiceCheck()) return;
		player.queue.clear();

		return interaction.editReply({
			embeds: [embed.setDescription('🔹 | Queue cleared.')],
		});
    }
};

export default subCommand;
