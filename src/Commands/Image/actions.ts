import {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	PermissionFlagsBits,
} from 'discord.js';
import { WaifuEngine } from '../../Modules/APIs/waifuAPI';
import { Command } from '../../Interfaces/interfaces.js';

const { SendMessages, EmbedLinks } = PermissionFlagsBits;

const command: Command = {
	botPermissions: [SendMessages, EmbedLinks],
	data: new SlashCommandBuilder()
		.setName('actions')
		.setDescription('Express your emotions to someone with actions!')
		.addStringOption((options) =>
			options
				.setName('action')
				.setDescription('Select an action.')
				.addChoices(
					{ name: '🔹 | Bite', value: 'bite' },
					{ name: '🔹 | Blush', value: 'blush' },
					{ name: '🔹 | Bonk', value: 'bonk' },
					{ name: '🔹 | Bully', value: 'bully' },
					{ name: '🔹 | Cringe', value: 'cringe' },
					{ name: '🔹 | Cry', value: 'cry' },
					{ name: '🔹 | Cuddle', value: 'cuddle' },
					{ name: '🔹 | Handhold', value: 'handhold' },
					{ name: '🔹 | Highfive', value: 'highfive' },
					{ name: '🔹 | Hug', value: 'hug' },
					{ name: '🔹 | Kiss', value: 'kiss' },
					{ name: '🔹 | Pat', value: 'pat' },
					{ name: '🔹 | Poke', value: 'poke' },
					{ name: '🔹 | Wave', value: 'wave' },
				)
				.setRequired(true),
		)
		.addUserOption((option) =>
			option
				.setName('target')
				.setDescription('Provide a target.')
				.setRequired(false),
		),
	async execute(interaction: ChatInputCommandInteraction) {
		const { options } = interaction;
		const waifuAPI = new WaifuEngine(interaction);
		const target = options.getUser('target');

		await interaction.deferReply();

		switch (options.getString('action')) {
		case 'bite':
			return waifuAPI.bite(target);

		case 'blush':
			return waifuAPI.blush();

		case 'bonk':
			return waifuAPI.bonk(target);

		case 'bully':
			return waifuAPI.bully(target);

		case 'cringe':
			return waifuAPI.cringe();

		case 'cry':
			return waifuAPI.cry();

		case 'cuddle':
			return waifuAPI.cuddle(target);

		case 'handhold':
			return waifuAPI.handhold(target);

		case 'highfive':
			return waifuAPI.highfive(target);

		case 'hug':
			return waifuAPI.hug(target);

		case 'kiss':
			return waifuAPI.kiss(target);

		case 'pat':
			return waifuAPI.pat(target);

		case 'poke':
			return waifuAPI.poke(target);

		case 'slap':
			return waifuAPI.slap(target);

		case 'wave':
			return waifuAPI.wave(target);

		default:
			break;
		}
	},
};

export default command;
