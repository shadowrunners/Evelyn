import { Discord, Slash, SlashGroup, SlashOption, SlashChoice } from 'discordx';
import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	ChannelType,
	TextChannel,
} from 'discord.js';
import { GuildDB as DB } from '../../Schemas/guild.js';

@Discord()
@SlashGroup({
	name: 'logs',
	description: 'Manage and configure moderation logging.',
	defaultMemberPermissions: 'Administrator',
})
@SlashGroup('levels')
export class Levels {
	@Slash({
		name: 'toggle',
		description: 'Gives you the ability to toggle logging on and off.',
	})
	async toggle(
		@SlashChoice({ name: 'Enable', value: 'enable' })
		@SlashChoice({ name: 'Disable', value: 'disable' })
		@SlashOption({
			description: 'Select one of the choices.',
			name: 'choice',
			required: true,
			type: ApplicationCommandOptionType.String,
		})
			choice: string,
			interaction: ChatInputCommandInteraction,
	) {
		const { guildId } = interaction;
		const data = await DB.findOne({ id: guildId });
		const embed = new EmbedBuilder().setColor('Blurple');

		if (choice === 'enable' && data.levels.enabled === true)
			return interaction.reply({
				embeds: [
					embed.setDescription('🔹 | The levelling system is already enabled.'),
				],
				ephemeral: true,
			});

		if (choice === 'disable' && data.levels.enabled === false)
			return interaction.reply({
				embeds: [
					embed.setDescription(
						'🔹 | The levelling system is already disabled.',
					),
				],
				ephemeral: true,
			});

		await DB.findOneAndUpdate(
			{
				id: guildId,
			},
			{
				$set: {
					'levels.enabled': choice === 'enable',
				},
			},
		);

		return interaction.reply({
			embeds: [
				embed.setDescription(
					`🔹 | The logging system has been ${
						choice === 'enable' ? 'enabled' : 'disabled'
					}.`,
				),
			],
			ephemeral: true,
		});
	}

	@Slash({
		name: 'setchannel',
		description: 'Sets the channel where logs will be sent.',
	})
	async setchannel(
		@SlashOption({
			description: 'Provide the channel.',
			name: 'channel',
			required: true,
			type: ApplicationCommandOptionType.Channel,
			channelTypes: [ChannelType.GuildText],
		})
			channel: TextChannel,
			interaction: ChatInputCommandInteraction,
	) {
		const { guildId } = interaction;
		const embed = new EmbedBuilder().setColor('Blurple');

		await DB.findOneAndUpdate(
			{
				id: guildId,
			},
			{
				$set: {
					'levels.channel': channel.id,
				},
			},
		);

		return interaction.reply({
			embeds: [
				embed.setDescription(
					`🔹 | Got it, the level up messages will now be sent to: <#${channel.id}>.`,
				),
			],
			ephemeral: true,
		});
	}

	@Slash({
		name: 'set-levelupmessage',
		description: 'Sets the channel where logs will be sent.',
	})
	async setlevelUpMessage(
		@SlashOption({
			name: 'message',
			description: 'Sets the Level Up message.',
			required: true,
			type: ApplicationCommandOptionType.String,
		})
			message: string,
			interaction: ChatInputCommandInteraction,
	) {
		const { guildId } = interaction;
		const embed = new EmbedBuilder().setColor('Blurple');

		await DB.findOneAndUpdate(
			{
				id: guildId,
			},
			{
				$set: {
					'levels.message': message,
				},
			},
		);

		return interaction.reply({
			embeds: [
				embed.setDescription(
					'🔹 | Got it, the level up message you provided has been set.',
				),
			],
			ephemeral: true,
		});
	}
}
