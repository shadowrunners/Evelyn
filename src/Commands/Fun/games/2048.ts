import {
	ChatInputCommandInteraction,
	ButtonStyle,
	EmbedBuilder,
} from 'discord.js';
import { Subcommand } from '../../../Interfaces/interfaces.js';
import { TwoZeroFourEight } from '@shadowrunners/gamecord';

const subCommand: Subcommand = {
	subCommand: 'games.2048',
	async execute(interaction: ChatInputCommandInteraction) {
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		const game = new TwoZeroFourEight({
			interaction,
			embed: {
				title: '2048',
				color: '#5865F2',
			},
			emojis: {
				up: '⬆️',
				down: '⬇️',
				left: '⬅️',
				right: '➡️',
			},
			playerOnlyMessage: '🔹 | Only {player} can use these buttons.',
			timeoutTime: 60000,
			buttonStyle: ButtonStyle.Primary,
		});

		game.startGame();
	},
};

export default subCommand;
