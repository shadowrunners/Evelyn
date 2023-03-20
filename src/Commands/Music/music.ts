import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { Command } from '../../interfaces/interfaces.js';
const { SendMessages, EmbedLinks, Connect, Speak } = PermissionFlagsBits;

const command: Command = {
	// botPermissions: [SendMessages, EmbedLinks, Connect, Speak],
	data: new SlashCommandBuilder()
		.setName('music')
		.setDescription('A complete music system.')
		.addSubcommand((options) =>
			options
				.setName('play')
				.setDescription('Play a song.')
				.addStringOption((option) =>
					option
						.setName('query')
						.setDescription('Provide the name of the song or URL.')
						.setRequired(true),
				),
		)
		.addSubcommand((options) =>
			options
				.setName('volume')
				.setDescription('Alter the volume.')
				.addNumberOption((option) =>
					option
						.setName('percent')
						.setDescription('Provide the volume.')
						.setRequired(true),
				),
		)
		.addSubcommand((options) =>
			options
				.setName('seek')
				.setDescription('Skip to a specific time in the song.')
				.addNumberOption((option) =>
					option
						.setName('time')
						.setDescription('Provide the timestamp.')
						.setRequired(true),
				),
		)
		.addSubcommand((options) =>
			options
				.setName('repeat')
				.setDescription('Repeat the current song or queue.')
				.addStringOption((option) =>
					option
						.setName('type')
						.setDescription('Select the loop type.')
						.setRequired(true)
						.addChoices(
							{ name: '🔹 | Queue', value: 'queue' },
							{ name: '🔹 | Song', value: 'song' },
							{ name: '🔹 | Off', value: 'off' },
						),
				),
		)
		.addSubcommand((options) =>
			options
				.setName('skip')
				.setDescription('Skips the currently playing song.'),
		)
		.addSubcommand((options) =>
			options
				.setName('pause')
				.setDescription('Pauses the currently playing song.'),
		)
		.addSubcommand((options) =>
			options
				.setName('resume')
				.setDescription('Resumes the currently playing song.'),
		)
		.addSubcommand((options) =>
			options
				.setName('stop')
				.setDescription(
					'Stops the currently playing songs and destroys the player.',
				),
		)
		.addSubcommand((options) =>
			options
				.setName('lyrics')
				.setDescription('Shows you the lyrics of the currently playing song.'),
		)
		.addSubcommand((options) =>
			options.setName('shuffle').setDescription('Shuffles the queue.'),
		)
		.addSubcommand((options) =>
			options
				.setName('nowplaying')
				.setDescription('Shows you the currently playing song.'),
		)
		.addSubcommand((options) =>
			options.setName('queue').setDescription('Shows you the queue.'),
		)
		.addSubcommand((options) =>
			options.setName('clear').setDescription('Clears the queue.'),
		)
		.addSubcommand((options) =>
			options
				.setName('filters')
				.setDescription('Applies a filter.')
				.addStringOption((option) =>
					option
						.setName('option')
						.setDescription('Select the filter you would like to be applied.')
						.setRequired(true)
						.addChoices(
							{ name: '🔹 | 3D', value: '3d' },
							{ name: '🔹 | Bass Boost', value: 'bassboost' },
							{ name: '🔹 | Karaoke', value: 'karaoke' },
							{ name: '🔹 | Nightcore', value: 'nightcore' },
							{ name: '🔹 | Slow Motion', value: 'slowmo' },
							{ name: '🔹 | Soft', value: 'soft' },
							{ name: '🔹 | TV', value: 'tv' },
							{ name: '🔹 | Treble Bass', value: 'treblebass' },
							{ name: '🔹 | Vaporwave', value: 'vaporwave' },
							{ name: '🔹 | Vibrato', value: 'vibrato' },
							{ name: '🔹 | Reset', value: 'reset' },
						),
				),
		),
};

export default command;
