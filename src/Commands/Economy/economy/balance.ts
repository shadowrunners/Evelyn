import { EcoUtils } from '../../../Modules/Utils/economyUtils';
import { Subcommand } from '../../../interfaces/interfaces';
import { ChatInputCommandInteraction } from 'discord.js';
import { Evelyn } from '../../../structures/Evelyn';

const subCommand: Subcommand = {
	subCommand: 'economy.balance',
	async execute(interaction: ChatInputCommandInteraction, client: Evelyn) {
		const { options, user } = interaction;
		const utils = new EcoUtils(interaction, client);
		const target = options.getUser('target') ?? user;

		await interaction.deferReply();

		return utils.balance(target);
	},
};

export default subCommand;
