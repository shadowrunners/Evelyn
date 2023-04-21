import { EcoUtils } from '../../../Modules/Utils/economyUtils';
import { Subcommand } from '../../../interfaces/interfaces';
import { ChatInputCommandInteraction } from 'discord.js';
import { Evelyn } from '../../../structures/Evelyn';

const subCommand: Subcommand = {
	subCommand: 'economy.deposit',
	async execute(interaction: ChatInputCommandInteraction, client: Evelyn) {
		const { options } = interaction;
		const amount = options.getNumber('amount');
		const utils = new EcoUtils(interaction, client);

		await interaction.deferReply();

		return utils.deposit(amount);
	},
};

export default subCommand;
