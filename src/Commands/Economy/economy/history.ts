import { EcoUtils } from '../../../Modules/Utils/economyUtils';
import { Subcommand } from '../../../interfaces/interfaces';
import { ChatInputCommandInteraction } from 'discord.js';
import { Evelyn } from '../../../structures/Evelyn';

const subCommand: Subcommand = {
	subCommand: 'economy.history',
	async execute(interaction: ChatInputCommandInteraction, client: Evelyn) {
		await interaction.deferReply();
		const utils = new EcoUtils(interaction, client);
		return utils.history();
	},
};

export default subCommand;
