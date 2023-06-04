import { Discord, Slash, SlashGroup, SlashOption, SlashChoice } from 'discordx';
import {
	ChannelType,
	TextChannel,
	EmbedBuilder,
	PermissionFlagsBits,
	ChatInputCommandInteraction,
	ApplicationCommandOptionType,
} from 'discord.js';
import { GuildDB as DB } from '../../Schemas/guild.js';
import { Evelyn } from '../../Evelyn.js';
import {
	encryptMyData,
	pleaseDecryptMyData,
} from '../../Functions/secureStorage.js';
const { Administrator } = PermissionFlagsBits;

@Discord()
@SlashGroup({
	description: 'Manage and configure moderation logging.',
	name: 'logs',
})
@SlashGroup('logs')
export class Logs {
	private embed: EmbedBuilder;

	constructor() {
		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
	}

	@Slash({
		description: 'Gives you the ability to toggle logging on and off.',
		defaultMemberPermissions: [Administrator],
		name: 'toggle',
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

		if (choice === 'enable' && data.logs.enabled === true)
			return interaction.reply({
				embeds: [
					this.embed.setDescription(
						'🔹 | The logging system is already enabled.',
					),
				],
				ephemeral: true,
			});

		if (choice === 'disable' && data.logs.enabled === false)
			return interaction.reply({
				embeds: [
					this.embed.setDescription(
						'🔹 | The logging system is already disabled.',
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
					'logs.enabled': choice === 'enable' ?? choice === 'false',
				},
			},
		);

		return interaction.reply({
			embeds: [
				this.embed.setDescription(
					`🔹 | The logging system has been ${
						choice === 'enable' ? 'enabled' : 'disabled'
					}.`,
				),
			],
			ephemeral: true,
		});
	}

	@Slash({
		description: 'Sets the channel where logs will be sent.',
		defaultMemberPermissions: [Administrator],
		name: 'setchannel',
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
			client: Evelyn,
	) {
		const { guildId } = interaction;
		const data = await DB.findOne({ id: guildId });

		if (data.logs?.channel) {
			const decryptedToken = pleaseDecryptMyData(
				data.logs?.webhook?.token,
				client,
			);

			const fetchWebhook = await client.fetchWebhook(
				data.logs?.webhook?.id,
				decryptedToken,
			);
			await fetchWebhook.delete();
		}

		channel
			.createWebhook({
				name: `${client.user.username} · Logs`,
				avatar: client.user.avatarURL(),
			})
			.then(async (webhook) => {
				const encryptedToken = encryptMyData(webhook.token, client);

				await DB.findOneAndUpdate(
					{
						id: guildId,
					},
					{
						$set: {
							'logs.channel': channel.id,
							'logs.webhook.id': webhook.id,
							'logs.webhook.token': encryptedToken,
						},
					},
				);
			});

		return interaction.reply({
			embeds: [
				this.embed.setDescription(
					`🔹 | Got it, logs will now be sent to: <#${channel.id}>.`,
				),
			],
			ephemeral: true,
		});
	}
}
