import { EcoUtils } from '../../../Modules/Utils/economyUtils';
import { Subcommand } from '../../../interfaces/interfaces';
import { ChatInputCommandInteraction } from 'discord.js';
import { Evelyn } from '../../../structures/Evelyn';

const subCommand: Subcommand = {
	subCommand: 'eco.leaderboard',
	async execute(interaction: ChatInputCommandInteraction, client: Evelyn) {
		const EcoEngine = new EcoUtils(interaction, client);
		await interaction.deferReply();
		return EcoEngine.leaderboard();
	},
};

export default subCommand;
