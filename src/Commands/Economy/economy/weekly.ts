import { EcoUtils } from '../../../Modules/Utils/economyUtils';
import { Subcommand } from '../../../interfaces/interfaces';
import { ChatInputCommandInteraction } from 'discord.js';
import { Evelyn } from '../../../structures/Evelyn';

const subCommand: Subcommand = {
	subCommand: 'economy.weekly',
	execute(interaction: ChatInputCommandInteraction, client: Evelyn) {
		const utils = new EcoUtils(interaction, client);
		return utils.weekly();
	},
};

export default subCommand;
