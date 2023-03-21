import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { Command } from '../../interfaces/interfaces.js';
const { SendMessages, EmbedLinks } = PermissionFlagsBits;

const command: Command = {
	// botPermissions: [SendMessages, 'EmbedLinks'],
	data: new SlashCommandBuilder()
		.setName('playlist')
		.setDescription('Curate your own playlist(s).')
		.addSubcommand((options) =>
			options
				.setName('create')
				.setDescription('Create a new playlist.')
				.addStringOption((option) =>
					option
						.setName('name')
						.setDescription('Provide a name for the playlist.')
						.setRequired(true),
				),
		)
		.addSubcommand((options) =>
			options
				.setName('delete')
				.setDescription('Delete your saved playlist.')
				.addStringOption((option) =>
					option
						.setName('name')
						.setDescription('Provide a name of the playlist.')
						.setRequired(true),
				),
		)
		.addSubcommand((options) =>
			options
				.setName('addcurrent')
				.setDescription('Add the currently playing song to the playlist.')
				.addStringOption((option) =>
					option
						.setName('name')
						.setDescription('Provide a name of the playlist.')
						.setRequired(true),
				),
		)
		.addSubcommand((options) =>
			options
				.setName('info')
				.setDescription('Lists the tracks of the provided playlist.')
				.addStringOption((option) =>
					option
						.setName('name')
						.setDescription('Provide a name of the playlist.')
						.setRequired(true),
				),
		)
		.addSubcommand((options) =>
			options.setName('list').setDescription('Lists all your playlists.'),
		)
		.addSubcommand((options) =>
			options
				.setName('removesong')
				.setDescription('Removes a song from your playlist.')
				.addStringOption((option) =>
					option
						.setName('name')
						.setDescription('Provide a name of the playlist.')
						.setRequired(true),
				)
				.addNumberOption((option) =>
					option
						.setName('songid')
						.setDescription('Provide the number of the song.')
						.setRequired(true),
				),
		),
};

export default command;
