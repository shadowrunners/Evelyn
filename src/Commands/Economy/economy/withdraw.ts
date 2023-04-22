import { EcoUtils } from '../../../Modules/Utils/economyUtils';
import { Subcommand } from '../../../interfaces/interfaces';
import { ChatInputCommandInteraction } from 'discord.js';
import { Evelyn } from '../../../structures/Evelyn';

const subCommand: Subcommand = {
	subCommand: 'eco.withdraw',
	execute(interaction: ChatInputCommandInteraction, client: Evelyn) {
		const { options } = interaction;
		const amount = options.getNumber('amount');
		const utils = new EcoUtils(interaction, client);

		return utils.withdraw(amount);
	},
};

export default subCommand;
