import { MusicUtils } from '../../../Modules/Utils/musicUtils.js';
import { ChatInputCommandInteraction } from 'discord.js';
import { Evelyn } from '../../../structures/Evelyn.js';
import { Subcommand } from '../../../interfaces/interfaces.js';

const subCommand: Subcommand = {
	subCommand: 'music.seek',
	async execute(interaction: ChatInputCommandInteraction, client: Evelyn) {
		const { options, guildId } = interaction;

		const player = client.manager.players.get(guildId);
		const musicUtils = new MusicUtils(interaction, player);

		await interaction.deferReply();

		if (musicUtils.check(['voiceCheck', 'checkPlaying'])) return;

		const time = options.getNumber('time');
		return musicUtils.seek(time);
	},
};

export default subCommand;
