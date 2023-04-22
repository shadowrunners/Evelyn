import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	PermissionFlagsBits,
	SlashCommandBuilder,
	TextChannel,
} from 'discord.js';
import { Command } from '../../interfaces/interfaces';
import { Util } from '../../Modules/Utils/utils';
import { LockdownDB as DB } from '../../Structures/Schemas/lockdown';

const { ManageChannels, SendMessages } = PermissionFlagsBits;

const command: Command = {
	data: new SlashCommandBuilder()
		.setName('lock')
		.setDescription('Locks a channel.')
		.setDefaultMemberPermissions(ManageChannels)
		.addStringOption((options) =>
			options
				.setName('reason')
				.setDescription('Provide a reason for the lockdown.')
				.setRequired(true),
		)
		.addStringOption((options) =>
			options
				.setName('time')
				.setDescription(
					'How long would you like the channel to stay locked for?',
				)
				.setRequired(false),
		),
	execute(interaction: ChatInputCommandInteraction) {
		const { msToTime } = new Util();
		const { guild, channel, options } = interaction;
		const lockedChannel = channel as TextChannel;
		const reason = options.getString('reason') || 'Unknown';
		const time = options.getString('time');
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		if (!channel.permissionsFor(guild.id).has(SendMessages))
			return interaction.reply({
				embeds: [embed.setDescription('🔹 | This channel is already locked.')],
				ephemeral: true,
			});

		lockedChannel.permissionOverwrites.edit(guild.id, {
			SendMessages: false,
		});

		interaction.reply({
			embeds: [
				embed.setDescription(`🔹 | This channel is now locked for: ${reason}`),
			],
		});

		if (!time) return;

		DB.create({
			guildId: guild.id,
			channelId: channel.id,
			timeLocked: Date.now() + msToTime(time),
		});

		setTimeout(async () => {
			lockedChannel.permissionOverwrites.edit(guild.id, {
				SendMessages: null,
			});

			interaction.editReply({
				embeds: [embed.setDescription('🔹 | This channel has been unlocked.')],
			});
			await DB.deleteOne({ channelId: channel.id }).catch();
		}, msToTime(time));
	},
};

export default command;
