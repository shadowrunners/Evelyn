import {
	SlashCommandBuilder,
	PermissionFlagsBits,
	ChannelType,
} from 'discord.js';
import { Command } from '../../interfaces/interfaces.js';

const { Administrator, SendMessages } = PermissionFlagsBits;
const { GuildText } = ChannelType;

const command: Command = {
	botPermissions: [SendMessages],
	data: new SlashCommandBuilder()
		.setName('tickets')
		.setDescription('Manage and configure tickets system.')
		.setDefaultMemberPermissions(Administrator)
		.addSubcommand((options) =>
			options
				.setName('toggle')
				.setDescription(
					'Gives you the ability to toggle tickets system on and off.',
				)
				.addStringOption((option) =>
					option
						.setName('choice')
						.setDescription('Select one of the choices.')
						.setRequired(true)
						.addChoices(
							{ name: 'Enable', value: 'enable' },
							{ name: 'Disable', value: 'disable' },
						),
				),
		)
		.addSubcommand((options) =>
			options
				.setName('configure')
				.setDescription('Configures the tickets system.')
				.addChannelOption((option) =>
					option
						.setName('transcripts')
						.setDescription(
							'Select the channel where transcripts will be sent.',
						)
						.addChannelTypes(GuildText)
						.setRequired(true),
				)
				.addRoleOption((option) =>
					option
						.setName('assistant-role')
						.setDescription(
							'Select the role that will be pinged when a new ticket is created.',
						)
						.setRequired(true),
				),
		)
		.addSubcommand((options) =>
			options
				.setName('manage-panel')
				.setDescription(
					'Customize the panel that will be sent for users to create tickets.',
				)
				.addStringOption((option) =>
					option
						.setName('color')
						.setDescription('Provide the hex value of the color.'),
				)
				.addStringOption((option) =>
					option
						.setName('title')
						.setDescription('Provide a title for the embed.'),
				)
				.addStringOption((option) =>
					option
						.setName('description')
						.setDescription('Provide a description for the embed.'),
				)
				.addStringOption((option) =>
					option
						.setName('author-name')
						.setDescription('Provide a name for the author tag of the embed.'),
				)
				.addStringOption((option) =>
					option
						.setName('author-icon')
						.setDescription(
							'Provide a link to an image for the icon URL displayed next to the author name.',
						),
				)
				.addStringOption((option) =>
					option
						.setName('footer-text')
						.setDescription(
							'Provide the text you\'d like to use for the embed\'s footer.',
						),
				)
				.addStringOption((option) =>
					option
						.setName('footer-icon')
						.setDescription('Provide a link to an image for the footer\'s icon.'),
				)
				.addStringOption((option) =>
					option
						.setName('image')
						.setDescription('Provide a link to an image for the embed.'),
				),
		)
		.addSubcommand((options) =>
			options
				.setName('send-panel')
				.setDescription('Sends the ticket panel in a channel.')
				.addChannelOption((option) =>
					option
						.setName('channel')
						.setDescription('Provide the channel.')
						.addChannelTypes(GuildText)
						.setRequired(true),
				),
		),
};

export default command;
