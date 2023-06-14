import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	PermissionFlagsBits,
	EmbedBuilder,
	TextChannel,
} from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { Util } from '../../Utils/Utils/Util.js';
import { LockdownDB as DB } from '../../Schemas/lockdown.js';

@Discord()
export class Lock {
	@Slash({
		name: 'lock',
		description: 'Locks a channel.',
		defaultMemberPermissions: PermissionFlagsBits.ManageChannels,
	})
	async lock(
		@SlashOption({
			name: 'reason',
			description: 'Provide a reason for the lockdown.',
			type: ApplicationCommandOptionType.String,
			required: true,
		})
		@SlashOption({
			name: 'time',
			description: 'How long would you like the channel to stay locked for?',
			type: ApplicationCommandOptionType.String,
			required: false,
		})
			reason: string,
			time: string,
			interaction: ChatInputCommandInteraction,
	) {
		const { msToTime } = new Util();
		const { guild, channel } = interaction;
		const lockedChannel = channel as TextChannel;
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		if (!channel.permissionsFor(guild.id).has(PermissionFlagsBits.SendMessages))
			return interaction.reply({
				embeds: [embed.setDescription('🔹 | This channel is already locked.')],
				ephemeral: true,
			});

		lockedChannel.permissionOverwrites.edit(guild.id, {
			SendMessages: false,
		});

		interaction.reply({
			embeds: [
				embed.setDescription(
					`🔹 | This channel is now locked for: ${reason || 'Unknown'}`,
				),
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
	}
}
