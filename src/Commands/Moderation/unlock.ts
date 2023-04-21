import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	PermissionFlagsBits,
	SlashCommandBuilder,
	TextChannel,
} from 'discord.js';
import { Command } from '../../interfaces/interfaces';
import { LockdownDB as DB } from '../../Structures/Schemas/lockdown';

const { ManageChannels, SendMessages } = PermissionFlagsBits;

const command: Command = {
	data: new SlashCommandBuilder()
		.setName('unlock')
		.setDescription('Unlocks a channel.')
		.setDefaultMemberPermissions(ManageChannels),
	async execute(interaction: ChatInputCommandInteraction) {
		const { guild, channel } = interaction;
		const lockedChannel = channel as TextChannel;
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		if (channel.permissionsFor(guild.id).has(SendMessages))
			return interaction.reply({
				embeds: [embed.setDescription('🔹 | This channel isn\'t locked.')],
				ephemeral: true,
			});

		lockedChannel.permissionOverwrites.edit(guild.id, {
			SendMessages: null,
		});

		await DB.deleteOne({ ChannelID: channel.id });

		interaction.reply({
			embeds: [
				embed.setDescription(
					`🔹 | The lockdown on <#${channel.id}> has been lifted.`,
				),
			],
		});
	},
};

export default command;
