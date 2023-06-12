import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	PermissionFlagsBits,
	HexColorString,
	EmbedBuilder,
	ChannelType,
	TextChannel,
	GuildMember,
} from 'discord.js';
import { Discord, SlashGroup, Slash, SlashChoice, SlashOption } from 'discordx';
import { GuildDB as DB } from '../../Schemas/guild.js';
import { replacePlaceholders } from '../../Utils/Utils/replacePlaceholders.js';

@Discord()
@SlashGroup({
	name: 'goodbye',
	description: 'Manage and configure goodbye messages.',
})
@SlashGroup('goodbye')
export class Goodbye {
	private embed: EmbedBuilder;

	constructor() {
		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
	}

	@Slash({
		name: 'toggle',
		description: 'Gives you the ability to toggle goodbye messages on and off.',
		defaultMemberPermissions: [PermissionFlagsBits.Administrator],
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

		if (choice === 'enable' && data.goodbye.enabled === true)
			return interaction.reply({
				embeds: [
					this.embed.setDescription(
						'🔹 | The goodbye system is already enabled.',
					),
				],
				ephemeral: true,
			});

		if (choice === 'disable' && data.goodbye.enabled === false)
			return interaction.reply({
				embeds: [
					this.embed.setDescription(
						'🔹 | The goodbye system is already disabled.',
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
					'goodbye.enabled': choice === 'enable' ?? choice === 'false',
				},
			},
		);

		return interaction.reply({
			embeds: [
				this.embed.setDescription(
					`🔹 | The goodbye system has been ${
						choice === 'enable' ? 'enabled' : 'disabled'
					}.`,
				),
			],
			ephemeral: true,
		});
	}

	@Slash({
		name: 'manageembed',
		description: 'Manage the embed sent when a user leaves the server.',
		defaultMemberPermissions: [PermissionFlagsBits.Administrator],
	})
	async manageembed(
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
		@SlashOption({
			name: 'messagecontent',
			description: 'Provide a message that will be sent alongside the embed.',
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
			messagecontent: string,
			interaction: ChatInputCommandInteraction,
	) {
		const { guildId } = interaction;
		const embed = new EmbedBuilder().setColor('Blurple');
		const data = await DB.findOne({ id: guildId });
		const { goodbye } = data;

		await DB.findOneAndUpdate(
			{
				id: guildId,
			},
			{
				$set: {
					'goodbye.embed.color': color,
					'goodbye.embed.title': title,
					'goodbye.embed.description': description,
					'goodbye.embed.author.name': authorname,
					'goodbye.embed.author.icon_url': authoricon,
					'goodbye.embed.footer.text': footertext,
					'goodbye.embed.footer.icon_url': footericon,
					'goodbye.embed.image.url': image,
					'goodbye.embed.messagecontent': messagecontent,
				},
			},
		);

		return interaction.reply({
			embeds: [
				embed
					.setTitle('Goodbye Embed Updated')
					.setDescription(
						'The following embed data has been successfully saved. Some values may return a null value. This is not a bug, it just means you didn\'t provide a value for it.\n\nRun /goodbye preview-embed to see a preview or wait for someone to leave.',
					)
					.addFields(
						{
							name: '🔹 | Color',
							value: `> ${goodbye.embed.color}`,
						},
						{
							name: '🔹 | Title',
							value: `> ${goodbye.embed.title}`,
						},
						{
							name: '🔹 | Description',
							value: `> ${goodbye.embed.description}`,
						},
						{
							name: '🔹 | Author Name',
							value: `> ${goodbye.embed.author.name}`,
						},
						{
							name: '🔹 | Author Icon',
							value: `> ${goodbye.embed.author.icon_url}`,
						},
						{
							name: '🔹 | Footer Text',
							value: `> ${goodbye.embed.footer.text}`,
						},
						{
							name: '🔹 | Footer Icon',
							value: `> ${goodbye.embed.footer.icon_url}`,
						},
						{
							name: '🔹 | Image',
							value: `> ${goodbye.embed.image.url}`,
						},
					),
			],
			ephemeral: true,
		});
	}

	@Slash({
		name: 'previewembed',
		description: 'Sends a preview of the embed.',
		defaultMemberPermissions: [PermissionFlagsBits.Administrator],
	})
	async previewembed(
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
		const { guildId, member } = interaction;
		const data = await DB.findOne({ id: guildId });
		const typedMember = member as GuildMember;

		const nEmbed = new EmbedBuilder().setColor('Blurple');

		const embed = data.goodbye.embed;
		const goodbyeEmbed = new EmbedBuilder();
		const content = data.goodbye.embed.messagecontent;
		const goodbyeMessage = replacePlaceholders(content, typedMember);

		if (embed.color) {
			const hexCodeRegex = /^#[0-9A-Fa-f]{6}$/;
			if (hexCodeRegex.test(embed.color)) goodbyeEmbed.setColor(embed.color);
		}

		if (embed.title) goodbyeEmbed.setTitle(embed.title);

		if (embed.description)
			goodbyeEmbed.setDescription(
				replacePlaceholders(embed.description, member as GuildMember) ||
					'Undefined',
			);

		if (embed.author)
			goodbyeEmbed.setAuthor({
				name:
					replacePlaceholders(embed.author.name, typedMember) || 'Undefined',
				iconURL: embed.author.icon_url,
			});

		if (embed.footer)
			goodbyeEmbed.setFooter({
				text:
					replacePlaceholders(embed.footer.text, typedMember) || 'Undefined',
				iconURL: embed.footer.icon_url,
			});

		if (embed.image?.url) goodbyeEmbed.setImage(embed.image?.url);
		if (embed.thumbnail?.url) goodbyeEmbed.setThumbnail(embed.thumbnail.url);

		if (content)
			channel.send({
				content: goodbyeMessage,
				embeds: [goodbyeEmbed],
			});
		else
			channel.send({
				embeds: [goodbyeEmbed],
			});

		return interaction.reply({
			embeds: [
				nEmbed.setDescription(
					`🔹 | Preview has been sent to <#${channel.id}>.`,
				),
			],
			ephemeral: true,
		});
	}

	@Slash({
		name: 'setchannel',
		description: 'Sets the channel where goodbye messages will be sent.',
		defaultMemberPermissions: [PermissionFlagsBits.Administrator],
	})
	async setchannel(
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
		const embed = new EmbedBuilder().setColor('Blurple');

		await DB.findOneAndUpdate(
			{
				id: guildId,
			},
			{
				$set: {
					'goodbye.channel': channel.id,
				},
			},
		);

		return interaction.reply({
			embeds: [
				embed.setDescription(
					`🔹 | Got it, goodbye messages will now be sent to: <#${channel.id}>.`,
				),
			],
			ephemeral: true,
		});
	}
}
