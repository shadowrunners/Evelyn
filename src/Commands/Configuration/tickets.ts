import { Discord, Slash, SlashGroup, SlashOption, SlashChoice } from 'discordx';
import {
	ChatInputCommandInteraction,
	ApplicationCommandOptionType,
	PermissionFlagsBits,
	ActionRowBuilder,
	HexColorString,
	ButtonBuilder,
	EmbedBuilder,
	TextChannel,
	ChannelType,
	ButtonStyle,
	Role,
} from 'discord.js';
import { GuildDB as DB } from '../../Schemas/guild.js';
const { Administrator } = PermissionFlagsBits;

@Discord()
@SlashGroup({
	name: 'tickets',
	description: 'Manage and configure tickets system.',
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
		defaultMemberPermissions: [Administrator],
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
		defaultMemberPermissions: [Administrator],
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
		defaultMemberPermissions: [Administrator],
	})
	async managepanel(
		@SlashOption({
			name: 'color',
			description: 'Provide the hex value of the color.',
			type: ApplicationCommandOptionType.String,
		})
		@SlashOption({
			name: 'title',
			description: 'Provide a title for the embed.',
			type: ApplicationCommandOptionType.String,
		})
		@SlashOption({
			name: 'description',
			description: 'Provide a description for the embed.',
			type: ApplicationCommandOptionType.String,
		})
		@SlashOption({
			name: 'authorname',
			description: 'Provide a name for the author tag of the embed.',
			type: ApplicationCommandOptionType.String,
		})
		@SlashOption({
			name: 'authoricon',
			description:
				'Provide a link to an image for the icon URL displayed next to the author name.',
			type: ApplicationCommandOptionType.String,
		})
		@SlashOption({
			name: 'footertext',
			description: 'Provide the text you\'d like to use for the embed\'s footer.',
			type: ApplicationCommandOptionType.String,
		})
		@SlashOption({
			name: 'footericon',
			description: 'Provide a link to an image for the footer\'s icon.',
			type: ApplicationCommandOptionType.String,
		})
		@SlashOption({
			name: 'image',
			description: 'Provide a link to an image for the embed.',
			type: ApplicationCommandOptionType.String,
		})
			color: HexColorString,
			title: string,
			description: string,
			authorname: string,
			authoricon: string,
			footertext: string,
			footericon: string,
			image: string,
			interaction: ChatInputCommandInteraction,
	) {
		const { guildId } = interaction;
		const embed = new EmbedBuilder().setColor('Blurple');
		const data = await DB.findOne({ id: guildId });
		const { tickets } = data;

		await DB.findOneAndUpdate(
			{
				id: guildId,
			},
			{
				$set: {
					'tickets.embed.color': color,
					'tickets.embed.title': title,
					'tickets.embed.description': description,
					'tickets.embed.author.name': authorname,
					'tickets.embed.author.icon_url': authoricon,
					'tickets.embed.footer.text': footertext,
					'tickets.embed.footer.icon_url': footericon,
					'tickets.embed.image.url': image,
				},
			},
		);

		return interaction.reply({
			embeds: [
				embed
					.setTitle('Ticket Embed Updated')
					.setDescription(
						'The following embed data has been successfully saved. Some values may return a null value. This is not a bug, it just means you didn\'t provide a value for it.',
					)
					.addFields(
						{
							name: '🔹 | Color',
							value: `> ${tickets.embed.color}`,
						},
						{
							name: '🔹 | Title',
							value: `> ${tickets.embed.title}`,
						},
						{
							name: '🔹 | Description',
							value: `> ${tickets.embed.description}`,
						},
						{
							name: '🔹 | Author Name',
							value: `> ${tickets.embed.author.name}`,
						},
						{
							name: '🔹 | Author Icon',
							value: `> ${tickets.embed.author.icon_url}`,
						},
						{
							name: '🔹 | Footer Text',
							value: `> ${tickets.embed.footer.text}`,
						},
						{
							name: '🔹 | Footer Icon',
							value: `> ${tickets.embed.footer.icon_url}`,
						},
						{
							name: '🔹 | Image',
							value: `> ${tickets.embed.image.url}`,
						},
					),
			],
			ephemeral: true,
		});
	}

	@Slash({
		name: 'sendpanel',
		description: 'Sends the ticket panel in a channel.',
		defaultMemberPermissions: [Administrator],
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
