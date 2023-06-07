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
} from '../../Utils/Utils/secureStorage.js';
const { Administrator } = PermissionFlagsBits;

@Discord()
@SlashGroup({
	description: 'Manage and configure confessions.',
	name: 'confessions',
})
@SlashGroup('confessions')
export class Confessions {
	private embed: EmbedBuilder;

	constructor() {
		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
	}

	@Slash({
		description: 'Gives you the ability to toggle anti-phishing on and off.',
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

		if (choice === 'enable' && data.confessions.enabled === true)
			return interaction.reply({
				embeds: [
					this.embed.setDescription(
						'🔹 | The confessions system is already enabled.',
					),
				],
				ephemeral: true,
			});

		if (choice === 'disable' && data.confessions.enabled === false)
			return interaction.reply({
				embeds: [
					this.embed.setDescription(
						'🔹 | The confessions system is already disabled.',
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
					'confessions.enabled': choice === 'enable' ?? choice === 'false',
				},
			},
		);

		return interaction.reply({
			embeds: [
				this.embed.setDescription(
					`🔹 | The confessions system has been ${
						choice === 'enable' ? 'enabled' : 'disabled'
					}.`,
				),
			],
			ephemeral: true,
		});
	}

	@Slash({
		description: 'Sets the channel where confessions will be sent.',
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

		if (data.confessions?.channel) {
			const decryptedToken = pleaseDecryptMyData(
				data.confessions?.webhook?.token,
				client,
			);

			const fetchWebhook = await client.fetchWebhook(
				data.confessions?.webhook?.id,
				decryptedToken,
			);
			await fetchWebhook.delete();
		}

		channel
			.createWebhook({
				name: `${client.user.username} · Confessions`,
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
							'confessions.channel': channel.id,
							'confessions.webhook.id': webhook.id,
							'confessions.webhook.token': encryptedToken,
						},
					},
				);
			});

		return interaction.reply({
			embeds: [
				this.embed.setDescription(
					`🔹 | Got it, confessions will now be sent to: <#${channel.id}>.`,
				),
			],
			ephemeral: true,
		});
	}
}
