import { ChatInputCommandInteraction, ButtonStyle } from 'discord.js';
import { Subcommand } from '../../../Interfaces/interfaces.js';
import { Connect4 } from '@shadowrunners/gamecord';

const subCommand: Subcommand = {
	subCommand: 'games.connect4',
	async execute(interaction: ChatInputCommandInteraction) {
		const { options } = interaction;
		const game = new Connect4({
			interaction,
			opponent: options.getUser('target'),
			embed: {
				title: 'Connect4',
				statusTitle: 'Status',
				color: '#5865F2',
			},
			emojis: {
				board: '⚪',
				player1: '🔴',
				player2: '🟡',
			},
			playerOnlyMessage: '🔹 | Only {player} can use these buttons.',
			timeoutTime: 60000,
			buttonStyle: ButtonStyle.Primary,
			turnMessage: '🔹 | It\'s **{player}**\'s turn.',
			winMessage: '🔹 | **{player}** won this match of Connect4!',
			tieMessage: '🔹 | It was a tie, no one won.',
			timeoutMessage:
				'🔹 | The game was unfinished. As a result, no one won the game.',
			requestMessage:
				'🔹 | {player} has invited you for a round of **Connect4**.',
			rejectMessage: '🔹 | The player denied your request.',
		});

		game.startGame();
	},
};

export default subCommand;
