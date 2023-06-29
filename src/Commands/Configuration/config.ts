/* eslint-disable no-case-declarations */
import { Discord, Slash, SlashGroup, SlashOption, SlashChoice } from 'discordx';
import {
	ActionRowBuilder,
	ApplicationCommandOptionType,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	ChannelType,
	ChatInputCommandInteraction,
	CommandInteraction,
	Embed,
	EmbedBuilder,
	GuildMember,
	InteractionType,
	PresenceUpdateStatus,
	StringSelectMenuBuilder,
	StringSelectMenuInteraction,
	StringSelectMenuOptionBuilder,
	TextChannel,
} from 'discord.js';
import { GuildDB as DB } from '../../Schemas/guild.js';
import { Evelyn } from '../../Evelyn.js';
import {
	encryptMyData,
	pleaseDecryptMyData,
} from '../../Utils/Utils/secureStorage.js';
import { Builder } from '../../Utils/Utils/EmbedBuilder.js';
import { replacePlaceholders } from '../../Utils/Utils/replacePlaceholders.js';

@Discord()
@SlashGroup({
	name: 'config',
	description: 'Configure Evelyn\'s systems.',
	defaultMemberPermissions: 'Administrator',
})
@SlashGroup({
	name: 'antiphishing',
	description: 'A complete anti-phishing system.',
	root: 'config',
})
@SlashGroup({
	name: 'confessions',
	description: 'A complete confessions system.',
	root: 'config',
})
@SlashGroup({
	name: 'goodbye',
	description: 'A complete goodbye message system.',
	root: 'config',
})
@SlashGroup({
	name: 'levels',
	description: 'A complete levelling system.',
	root: 'config',
})
@SlashGroup({
	name: 'logs',
	description: 'A complete moderation logging system.',
	root: 'config',
})
@SlashGroup({
	name: 'verify',
	description: 'A complete verification system.',
	root: 'config',
})
@SlashGroup({
	name: 'welcome',
	description: 'A complete welcome system.',
	root: 'config',
})
export class Config {
	private embed: EmbedBuilder;

	@Slash({
		name: 'toggle',
		description: 'Gives you the ability to toggle anti-phishing on and off.',
	})
	@SlashGroup('antiphishing', 'config')
	async toggle_AP(
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
		const isEnabled = choice === 'enable';
		return this.toggleFeature('antiphishing', isEnabled, interaction);
	}

	@Slash({
		name: 'toggle',
		description: 'Gives you the ability to toggle confessions on and off.',
	})
	@SlashGroup('confessions', 'config')
	async toggle_CF(
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
		const isEnabled = choice === 'enable';
		return this.toggleFeature('confessions', isEnabled, interaction);
	}

	@Slash({
		name: 'setchannel',
		description: 'Sets the channel where confessions will be sent in.',
	})
	@SlashGroup('confessions', 'config')
	async setchannel_CF(
		@SlashOption({
			description: 'Provide a channel.',
			name: 'channel',
			required: true,
			type: ApplicationCommandOptionType.Channel,
		})
			channel: TextChannel,
			interaction: ChatInputCommandInteraction,
			client: Evelyn,
	) {
		return this.updateWebhook('confessions', interaction, channel, client);
	}

	@Slash({
		name: 'toggle',
		description: 'Gives you the ability to toggle goodbye messages on and off.',
	})
	@SlashGroup('goodbye', 'config')
	async toggle_GB(
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
		const isEnabled = choice === 'enable';
		return this.toggleFeature('goodbye', isEnabled, interaction);
	}

	@Slash({
		name: 'setchannel',
		description: 'Sets the channel where goodbye messages will be sent in.',
	})
	@SlashGroup('goodbye', 'config')
	async setchannel_GB(
		@SlashOption({
			description: 'Provide a channel.',
			name: 'channel',
			required: true,
			type: ApplicationCommandOptionType.Channel,
		})
			channel: TextChannel,
			interaction: ChatInputCommandInteraction,
	) {
		return this.updateChannel('confessions', interaction, channel);
	}

	@Slash({
		name: 'manageembed',
		description: 'Manage the embed sent when a user leaves the server.',
	})
	@SlashGroup('goodbye', 'config')
	async manageembed_GB(interaction: ChatInputCommandInteraction) {
		const builder = new Builder(interaction, 'goodbye');
		return await builder.initalize();
	}

	@Slash({
		name: 'previewembed',
		description: 'Sends a preview of the embed.',
	})
	@SlashGroup('goodbye', 'config')
	async previeweembed_GB(
		@SlashOption({
			description: 'Provide a channel.',
			name: 'channel',
			required: true,
			channelTypes: [ChannelType.GuildText],
			type: ApplicationCommandOptionType.Channel,
		})
			channel: TextChannel,
			interaction: ChatInputCommandInteraction,
	) {
		return this.embedPreview('goodbye', channel, interaction);
	}

	@Slash({
		name: 'toggle',
		description: 'Gives you the ability to toggle goodbye messages on and off.',
	})
	@SlashGroup('goodbye', 'config')
	async toggle_GB(
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
		const isEnabled = choice === 'enable';
		return this.toggleFeature('goodbye', isEnabled, interaction);
	}

	@Slash({
		name: 'setchannel',
		description: 'Sets the channel where goodbye messages will be sent in.',
	})
	@SlashGroup('goodbye', 'config')
	async setchannel_GB(
		@SlashOption({
			description: 'Provide a channel.',
			name: 'channel',
			required: true,
			type: ApplicationCommandOptionType.Channel,
		})
			channel: TextChannel,
			interaction: ChatInputCommandInteraction,
	) {
		return this.updateChannel('confessions', interaction, channel);
	}

	/**
	 * Searches and returns the data about the provided server from the DB.
	 * @param guildId The server's ID.
	 * @returns The data retrieved from the DB.
	 */
	private async getData(guildId: string) {
		return await DB.findOne({
			id: guildId,
		});
	}

	private async isItEnabled(
		interaction: ChatInputCommandInteraction,
		type: string,
		choice: boolean,
	) {
		const { guildId } = interaction;
		const data = await this.getData(guildId);
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		if (choice === true && data[type]?.enabled === true)
			return interaction.reply({
				embeds: [embed.setDescription('🔹 | This feature is already enabled.')],
				ephemeral: true,
			});

		if (choice === false && data[type]?.enabled === false)
			return interaction.reply({
				embeds: [
					embed.setDescription('🔹 | This feature is already disabled.'),
				],
				ephemeral: true,
			});
	}

	private async toggleFeature(
		type: string,
		choice: boolean,
		interaction: ChatInputCommandInteraction,
	) {
		const { guildId } = interaction;
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		if (await this.isItEnabled(interaction, type, choice)) return;
		await this.updateDBStatus(guildId, type, choice);

		return interaction.reply({
			embeds: [
				embed.setDescription(
					`🔹 | This feature has been ${choice ? 'enabled' : 'disabled'}.`,
				),
			],
			ephemeral: true,
		});
	}

	/**
	 * Updates the feature's status.
	 * @param guildId The server's ID.
	 * @param feature The feature that will be updated.
	 * @param status The new status for the provided feature.
	 * @returns
	 */
	private async updateDBStatus(
		guildId: string,
		feature: string,
		status: boolean,
	) {
		return await DB.findOneAndUpdate(
			{
				id: guildId,
			},
			{
				[`${feature}.enabled`]: status,
			},
		);
	}

	private async updateWebhook(
		type: string,
		interaction: ChatInputCommandInteraction,
		channel: TextChannel,
		client: Evelyn,
	) {
		const { guildId } = interaction;
		const data = await this.getData(guildId);
		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		if (data[type]?.channel) {
			const decryptedToken = pleaseDecryptMyData(
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
				const encryptedToken = encryptMyData(webhook.token, client);

				await DB.findOneAndUpdate(
					{
						id: guildId,
					},
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
					`🔹 | Got it, confessions will now be sent to: <#${channel.id}>.`,
				),
			],
			ephemeral: true,
		});
	}

	private async updateChannel(
		type: string,
		interaction: ChatInputCommandInteraction,
		channel: TextChannel,
	) {
		const { guildId } = interaction;
		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		await DB.findOneAndUpdate(
			{
				id: guildId,
			},
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
		interaction: ChatInputCommandInteraction,
	) {
		const { guildId, member } = interaction;
		const data = await this.getData(guildId);
		const typedMember = member as GuildMember;

		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		const embedData = data[type].embed;
		const embed = new EmbedBuilder();
		const content = data[type].embed.messagecontent;
		const message = replacePlaceholders(content, typedMember);

		if (embedData.color) {
			const hexCodeRegex = /^#[0-9A-Fa-f]{6}$/;
			if (hexCodeRegex.test(embedData.color)) embed.setColor(embedData.color);
		}

		if (embedData.title) embed.setTitle(embedData.title);

		if (embedData.description)
			embed.setDescription(
				replacePlaceholders(embedData.description, member as GuildMember) ||
					'Undefined',
			);

		if (embedData.author)
			embed.setAuthor({
				name:
					replacePlaceholders(embedData.author.name, typedMember) ||
					'Undefined',
				iconURL: embedData.author.icon_url,
			});

		if (embedData.footer)
			embed.setFooter({
				text:
					replacePlaceholders(embedData.footer.text, typedMember) ||
					'Undefined',
				iconURL: embedData.footer.icon_url,
			});

		if (embedData.image?.url) embed.setImage(embedData.image?.url);
		if (embedData.thumbnail?.url) embed.setThumbnail(embedData.thumbnail.url);

		if (content)
			channel.send({
				content: message,
				embeds: [embed],
			});
		else
			channel.send({
				embeds: [embed],
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
}
