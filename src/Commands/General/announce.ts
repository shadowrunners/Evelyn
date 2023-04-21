import {
	SlashCommandBuilder,
	PermissionFlagsBits,
	ChatInputCommandInteraction,
	EmbedBuilder,
	TextChannel,
} from 'discord.js';
import { Command } from '../../interfaces/interfaces.js';
const { SendMessages, ManageGuild } = PermissionFlagsBits;

const command: Command = {
	botPermissions: [SendMessages],
	data: new SlashCommandBuilder()
		.setName('announce')
		.setDescription('Announce something.')
		.setDefaultMemberPermissions(ManageGuild)
		.addStringOption((option) =>
			option
				.setName('message')
				.setDescription(
					'Provide the message you would like to send in the announcement.',
				)
				.setRequired(true),
		)
		.addChannelOption((option) =>
			option
				.setName('channel')
				.setDescription(
					'Provide the channel where the announcement will be sent.',
				)
				.setRequired(true),
		)
		.addRoleOption((option) =>
			option
				.setName('role')
				.setDescription('Mention a role alongside the announcement.')
				.setRequired(false),
		),
	execute(interaction: ChatInputCommandInteraction) {
		const { options } = interaction;

		const message = options.getString('message');
		const channel = options.getChannel('channel') as TextChannel;
		const role = options.getRole('role');

		const embed = new EmbedBuilder()
			.setColor('Blurple')
			.setDescription(message)
			.setTimestamp();

		interaction.reply({
			embeds: [embed.setDescription('🔹 | Announcement sent.')],
		});

		if (role)
			return channel.send({ content: `<@${role.id}>`, embeds: [embed] });
		return channel.send({ embeds: [embed] });
	},
};

export default command;
