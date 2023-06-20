import { Discord, Slash, SlashGroup, SlashOption, SlashChoice } from 'discordx';
import {
	ChatInputCommandInteraction,
	ApplicationCommandOptionType,
	ActionRowBuilder,
	ButtonBuilder,
	EmbedBuilder,
	TextChannel,
	ChannelType,
	ButtonStyle,
	Role,
} from 'discord.js';
import { GuildDB as DB } from '../../Schemas/guild.js';
import { Builder } from '../../Utils/Utils/EmbedBuilder.js';

@Discord()
@SlashGroup({
	name: 'tickets',
	description: 'Manage and configure tickets system.',
	defaultMemberPermissions: 'Administrator',
})
@SlashGroup('tickets')
export class TicketConfig {
	private embed: EmbedBuilder;

	constructor() {
		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
	}

	@Slash({
		name: 'toggle',
		description: 'Gives you the ability to toggle tickets on and off.',
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

		if (choice === 'enable' && data.tickets.enabled === true)
			return interaction.reply({
				embeds: [
					this.embed.setDescription(
						'🔹 | The tickets system is already enabled.',
					),
				],
				ephemeral: true,
			});

		if (choice === 'disable' && data.tickets.enabled === false)
			return interaction.reply({
				embeds: [
					this.embed.setDescription(
						'🔹 | The tickets system is already disabled.',
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
					'tickets.enabled': choice === 'enable' ?? choice === 'false',
				},
			},
		);

		return interaction.reply({
			embeds: [
				this.embed.setDescription(
					`🔹 | The tickets system has been ${
						choice === 'enable' ? 'enabled' : 'disabled'
					}.`,
				),
			],
			ephemeral: true,
		});
	}

	@Slash({
		name: 'configure',
		description: 'Configures the tickets system.',
	})
	async configure(
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
			interaction: ChatInputCommandInteraction,
	) {
		const { guildId } = interaction;
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		await DB.findOneAndUpdate(
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
		name: 'managepanel',
		description:
			'Customize the panel that will be sent for users to create tickets.',
	})
	async managepanel(interaction: ChatInputCommandInteraction) {
		const builder = new Builder(interaction, 'tickets');
		return builder.initalize();
	}

	@Slash({
		name: 'sendpanel',
		description: 'Sends the ticket panel in a channel.',
	})
	async sendpanel(
		@SlashOption({
			name: 'channel',
			description: 'Provide the channel.',
			type: ApplicationCommandOptionType.Channel,
			channelTypes: [ChannelType.GuildText],
			required: true,
		})
			channel: TextChannel,
			interaction: ChatInputCommandInteraction,
	) {
		const { guildId } = interaction;
		const data = await DB.findOne({ id: guildId });

		const nEmbed = new EmbedBuilder().setColor('Blurple');

		const embed = data.tickets.embed;
		const ticketEmbed = new EmbedBuilder();

		if (embed.color) {
			const hexCodeRegex = /^#[0-9A-Fa-f]{6}$/;
			if (hexCodeRegex.test(embed.color)) ticketEmbed.setColor(embed.color);
		}

		if (embed.title) ticketEmbed.setTitle(embed.title);

		if (embed.description)
			ticketEmbed.setDescription(embed.description || 'Undefined');

		if (embed.author)
			ticketEmbed.setAuthor({
				name: embed.author.name,
				iconURL: embed.author.icon_url,
			});

		if (embed.footer)
			ticketEmbed.setFooter({
				text: embed.footer.text || 'Undefined',
				iconURL: embed.footer.icon_url,
			});

		if (embed.image?.url) ticketEmbed.setImage(embed.image?.url);
		if (embed.thumbnail?.url) ticketEmbed.setThumbnail(embed.thumbnail.url);

		const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId('createTicket')
				.setLabel('Open a Ticket')
				.setEmoji('📩')
				.setStyle(ButtonStyle.Primary),
		);

		channel.send({
			embeds: [ticketEmbed],
			components: [buttons],
		});

		return interaction.reply({
			embeds: [
				nEmbed.setDescription(
					`🔹 | The ticket panel has been sent in: <#${channel.id}>.`,
				),
			],
			ephemeral: true,
		});
	}
}
