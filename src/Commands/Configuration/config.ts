/* eslint-disable no-case-declarations */
import { Discord, Slash, SlashGroup, SlashOption, SlashChoice } from 'discordx';
import type { ExtendedChatInteraction } from '../../Interfaces/Interfaces.js';
import {
	ApplicationCommandOptionType,
	ActionRowBuilder,
	ButtonBuilder,
	EmbedBuilder,
	ChannelType,
	TextChannel,
	ButtonStyle,
	Role,
} from 'discord.js';
import { replacePlaceholders } from '../../Utils/Utils/replacePlaceholders.js';
import { SecureStorage } from '../../Utils/Utils/secureStorage.js';
import { Builder } from '../../Utils/Utils/EmbedBuilder.js';
import { GuildDB as DB } from '../../Schemas/guild.js';
import { Evelyn } from '../../Evelyn.js';

@Discord()
@SlashGroup({
	name: 'config',
	description: 'Configure Evelyn\'s systems.',
	defaultMemberPermissions: 'Administrator',
})
@SlashGroup({
	name: 'levels',
	description: 'A complete levelling system.',
	root: 'config',
})
@SlashGroup({
	name: 'tickets',
	description: 'A complete tickets system.',
	root: 'config',
})
@SlashGroup({
	name: 'verify',
	description: 'A complete verification system.',
	root: 'config',
})
export class Config {
	private embed: EmbedBuilder;
	private secureStorage: SecureStorage;

	constructor() {
		this.secureStorage = new SecureStorage();
	}

	@Slash({
		name: 'toggle',
		description:
			'Gives you the ability to toggle the chosen feature on and off.',
	})
	@SlashGroup('config')
	toggle_config(
		@SlashChoice({ name: 'Anti-Phish', value: 'antiphishing' })
		@SlashChoice({ name: 'Confessions', value: 'confessions' })
		@SlashChoice({ name: 'Goodbye', value: 'goodbye' })
		@SlashChoice({ name: 'Levels', value: 'levels' })
		@SlashChoice({ name: 'Logs', value: 'logs' })
		@SlashChoice({ name: 'Tickets', value: 'tickets' })
		@SlashChoice({ name: 'Verification', value: 'verify' })
		@SlashChoice({ name: 'Welcome', value: 'welcome' })
		@SlashOption({
			description: 'Select one of the choices.',
			name: 'choice',
			required: true,
			type: ApplicationCommandOptionType.String,
		})
			choice: string,
			interaction: ExtendedChatInteraction,
	) {
		return this.toggleFeature(choice, interaction);
	}

	@Slash({
		name: 'setchannel',
		description:
			'Gives you the ability to set the channel of the chosen feature.',
	})
	@SlashGroup('config')
	setchannel(
		@SlashChoice({ name: 'Confessions', value: 'confessions' })
		@SlashChoice({ name: 'Goodbye', value: 'goodbye' })
		@SlashChoice({ name: 'Levels', value: 'levels' })
		@SlashChoice({ name: 'Logs', value: 'logs' })
		@SlashChoice({ name: 'Welcome', value: 'welcome' })
		@SlashOption({
			name: 'choice',
			description: 'Select one of the choices.',
			required: true,
			type: ApplicationCommandOptionType.String,
		})
		@SlashOption({
			name: 'channel',
			description: 'Provide a channel.',
			required: true,
			channelTypes: [ChannelType.GuildText],
			type: ApplicationCommandOptionType.Channel,
		})
			choice: string,
			channel: TextChannel,
			interaction: ExtendedChatInteraction,
			client: Evelyn,
	) {
		switch (choice) {
		case 'confessions':
			return this.updateWebhook('confessions', interaction, channel, client);
		case 'goodbye':
			return this.updateChannel('goodbye', interaction, channel);
		case 'levels':
			return this.updateChannel('levels', interaction, channel);
		case 'logs':
			return this.updateWebhook('confessions', interaction, channel, client);
		case 'welcome':
			return this.updateChannel('welcome', interaction, channel);
		default:
			break;
		}
	}

	@Slash({
		name: 'manageembed',
		description: 'Manage the embed sent when a user leaves the server.',
	})
	@SlashGroup('config')
	manageembed(
		@SlashChoice({ name: 'Goodbye', value: 'goodbye' })
		@SlashChoice({ name: 'Tickets', value: 'tickets' })
		@SlashChoice({ name: 'Welcome', value: 'welcome' })
		@SlashOption({
			name: 'choice',
			description: 'Select one of the choices.',
			required: true,
			type: ApplicationCommandOptionType.String,
		})
			choice: string,
			interaction: ExtendedChatInteraction,
	) {
		return this.embedManage(interaction, choice);
	}

	@Slash({
		name: 'previewembed',
		description: 'Sends a preview of the chosen system\'s embed.',
	})
	@SlashGroup('config')
	previewembed(
		@SlashChoice({ name: 'Goodbye', value: 'goodbye' })
		@SlashChoice({ name: 'Tickets', value: 'tickets' })
		@SlashChoice({ name: 'Welcome', value: 'welcome' })
		@SlashOption({
			name: 'choice',
			description: 'Select one of the choices.',
			required: true,
			type: ApplicationCommandOptionType.String,
		})
		@SlashOption({
			name: 'channel',
			description: 'Provide a channel.',
			required: true,
			channelTypes: [ChannelType.GuildText],
			type: ApplicationCommandOptionType.Channel,
		})
			channel: TextChannel,
			choice: string,
			interaction: ExtendedChatInteraction,
	) {
		return this.embedPreview(choice, channel, interaction);
	}

	@Slash({
		name: 'set-levelupmessage',
		description: 'Sets the message that will be sent when a user levels up.',
	})
	@SlashGroup('levels', 'config')
	async setlvlmsg_lvls(
		@SlashOption({
			name: 'message',
			description: 'Sets the Level Up message.',
			required: true,
			type: ApplicationCommandOptionType.String,
		})
			message: string,
			interaction: ExtendedChatInteraction,
	) {
		const { guildId } = interaction;
		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		await DB.updateOne(
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
				this.embed.setDescription(
					'🔹 | Got it, the level up message you provided has been set.',
				),
			],
			ephemeral: true,
		});
	}

	@Slash({
		name: 'configure',
		description: 'Configures the tickets system.',
	})
	@SlashGroup('tickets', 'config')
	async configure_tickets(
		@SlashOption({
			name: 'transcripts',
			description: 'Select the channel where transcripts will be sent.',
			required: true,
			type: ApplicationCommandOptionType.Channel,
			channelTypes: [ChannelType.GuildText],
		})
		@SlashOption({
			name: 'assistantrole',
			description:
				'Select the role that will be pinged when a new ticket is created.',
			required: true,
			type: ApplicationCommandOptionType.Role,
		})
			transcripts: TextChannel,
			assistantrole: Role,
			interaction: ExtendedChatInteraction,
	) {
		const { guildId } = interaction;
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		await DB.updateOne(
			{
				id: guildId,
			},
			{
				$set: {
					'tickets.transcripts': transcripts.id,
					'tickets.assistantRole': assistantrole.id,
				},
			},
		);

		return interaction.reply({
			embeds: [
				embed.setTitle('Configuration Updated').addFields(
					{
						name: '🔹 | Transcripts Channel',
						value: `> <#${transcripts.id}>`,
					},
					{
						name: '🔹 | Assistant Role',
						value: `> <@&${assistantrole.id}>`,
					},
				),
			],
			ephemeral: true,
		});
	}

	@Slash({
		name: 'setrole',
		description:
			'Sets the role that will be assigned to users after they pass verification.',
	})
	@SlashGroup('verify', 'config')
	async setrole_verify(
		@SlashOption({
			name: 'verifyrole',
			description: 'Provide the role.',
			required: true,
			type: ApplicationCommandOptionType.Role,
		})
			verifyrole: Role,
			interaction: ExtendedChatInteraction,
	) {
		const { guildId } = interaction;
		const embed = new EmbedBuilder().setColor('Blurple');

		await DB.updateOne(
			{
				id: guildId,
			},
			{
				$set: {
					'verification.role': verifyrole.id,
				},
			},
		);

		return interaction.reply({
			embeds: [
				embed.setDescription(
					`🔹 | Got it, the <@&${verifyrole.id}> will now be assigned to users who pass verification.`,
				),
			],
			ephemeral: true,
		});
	}

	/**
	 * Searches and returns the data about the provided server from the DB.
	 * @async
	 * @param guildId The server's ID.
	 * @returns The data retrieved from the DB.
	 */
	private async getData(guildId: string) {
		return await DB.findOne({
			id: guildId,
		});
	}

	/**
	 * Toggles the specified feature on and off.
	 * @async
	 * @param feature The feature that will be enabled / disabled.
	 * @param interaction The interaction object.
	 * @returns A response saying that the feature has been enabled or disabled.
	 */
	private async toggleFeature(
		feature: string,
		interaction: ExtendedChatInteraction,
	) {
		const { guildId } = interaction;
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		const data = await this.getData(guildId);
		const status = !data[feature].enabled;

		if (status === true && data[feature]?.enabled === true)
			return interaction.reply({
				embeds: [embed.setDescription('🔹 | This feature is already enabled.')],
				ephemeral: true,
			});

		if (status === false && data[feature]?.enabled === false)
			return interaction.reply({
				embeds: [
					embed.setDescription('🔹 | This feature is already disabled.'),
				],
				ephemeral: true,
			});

		await DB.updateOne(
			{ id: guildId },
			{
				[`${feature}.enabled`]: status,
			},
		);

		return interaction.reply({
			embeds: [
				embed.setDescription(
					`🔹 | This feature has been ${status ? 'enabled' : 'disabled'}.`,
				),
			],
			ephemeral: true,
		});
	}

	/**
	 * Updates the webhook of the specified system.
	 * @async
	 * @param type The type of system.
	 * @param interaction The interaction object.
	 * @param channel The provided channel.
	 * @param client The Evelyn object.
	 * @returns A response saying that the channel has been updated.
	 */
	private async updateWebhook(
		type: string,
		interaction: ExtendedChatInteraction,
		channel: TextChannel,
		client: Evelyn,
	) {
		const { guildId } = interaction;
		const data = await this.getData(guildId);
		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		if (data[type]?.channel) {
			const decryptedToken = this.secureStorage.decrypt(
				data[type]?.webhook?.token,
				client,
			);

			const fetchWebhook = await client.fetchWebhook(
				data[type]?.webhook?.id,
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
				const encryptedToken = this.secureStorage.encrypt(
					webhook.token,
					client,
				);

				await DB.updateOne(
					{ id: guildId },
					{
						$set: {
							[`${type}.channel`]: channel.id,
							[`${type}.webhook.id`]: webhook.id,
							[`${type}.webhook.token`]: encryptedToken,
						},
					},
				);
			});

		return interaction.reply({
			embeds: [
				this.embed.setDescription(
					`🔹 | Got it, the messages of this system will now be sent to: <#${channel.id}>.`,
				),
			],
			ephemeral: true,
		});
	}

	/**
	 * Updates the channel of the specified system.
	 * @async
	 * @param type The type of system.
	 * @param interaction The interaction object.
	 * @param channel The new channel.
	 */
	private async updateChannel(
		type: string,
		interaction: ExtendedChatInteraction,
		channel: TextChannel,
	) {
		const { guildId } = interaction;
		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		await DB.updateOne(
			{ id: guildId },
			{
				$set: {
					[`${type}.channel`]: channel.id,
				},
			},
		);

		return interaction.reply({
			embeds: [
				this.embed.setDescription(
					`🔹 | Got it, ${type} messages will now be sent to: <#${channel.id}>.`,
				),
			],
			ephemeral: true,
		});
	}

	private async embedPreview(
		type: string,
		channel: TextChannel,
		interaction: ExtendedChatInteraction,
	) {
		const { guildId, member } = interaction;
		const data = await this.getData(guildId);

		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		const embedData = data[type].embed;
		const message = embedData.messagecontent;

		if (embedData?.color?.match(/^#[0-9A-Fa-f]{6}$/))
			this.embed.setColor(embedData.color);

		if (embedData?.title) this.embed.setTitle(embedData?.title);

		if (embedData?.description)
			this.embed.setDescription(
				replacePlaceholders(embedData.description, member) ??
					'This is just a placeholder so that the bot doesn\'t crash. If you see this, you probably forgot to define a description or haven\'t set up the embed yet.',
			);

		if (embedData?.author)
			this.embed.setAuthor({
				name: replacePlaceholders(embedData.author.name, member),
				iconURL: embedData.author.icon_url,
			});

		if (embedData?.footer)
			this.embed.setFooter({
				text: replacePlaceholders(embedData.footer.text, member),
				iconURL: embedData.footer.icon_url,
			});

		if (embedData.image?.url) this.embed.setImage(embedData.image?.url);
		if (embedData.thumbnail?.url)
			this.embed.setThumbnail(embedData.thumbnail.url);

		if (type === 'tickets') {
			const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
				new ButtonBuilder()
					.setCustomId('createTicket')
					.setLabel('Open a Ticket')
					.setEmoji('📩')
					.setStyle(ButtonStyle.Primary),
			);

			channel.send({
				embeds: [this.embed],
				components: [buttons],
			});

			return interaction.reply({
				embeds: [
					this.embed.setDescription(
						`🔹 | The ticket panel has been sent in: <#${channel.id}>.`,
					),
				],
				ephemeral: true,
			});
		}

		const messageRevised = replacePlaceholders(message, member);
		const content = messageRevised ? { content: messageRevised } : {};

		channel.send({
			...content,
			embeds: [this.embed],
		});

		return interaction.reply({
			embeds: [
				this.embed.setDescription(
					`🔹 | Preview has been sent to <#${channel.id}>.`,
				),
			],
			ephemeral: true,
		});
	}

	private async embedManage(
		interaction: ExtendedChatInteraction,
		type: string,
	) {
		const builder = new Builder(interaction, type);
		return await builder.initialize();
	}
}
