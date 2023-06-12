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
import { replacePlaceholders } from '../../Utils/Utils/replacePlaceholders.js';
import { GuildDB as DB } from '../../Schemas/guild.js';

@Discord()
@SlashGroup({
	name: 'welcome',
	description: 'Manage and configure welcome messages.',
})
@SlashGroup('welcome')
export class Welcome {
	private embed: EmbedBuilder;

	constructor() {
		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
	}

	@Slash({
		name: 'toggle',
		description: 'Gives you the ability to toggle welcome messages on and off.',
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

		if (choice === 'enable' && data.welcome.enabled === true)
			return interaction.reply({
				embeds: [
					this.embed.setDescription(
						'🔹 | The welcome system is already enabled.',
					),
				],
				ephemeral: true,
			});

		if (choice === 'disable' && data.welcome.enabled === false)
			return interaction.reply({
				embeds: [
					this.embed.setDescription(
						'🔹 | The welcome system is already disabled.',
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
					'welcome.enabled': choice === 'enable' ?? choice === 'false',
				},
			},
		);

		return interaction.reply({
			embeds: [
				this.embed.setDescription(
					`🔹 | The welcome system has been ${
						choice === 'enable' ? 'enabled' : 'disabled'
					}.`,
				),
			],
			ephemeral: true,
		});
	}

	@Slash({
		name: 'manageembed',
		description: 'Manage the embed sent when a user joins the server.',
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
		const { welcome } = data;

		await DB.findOneAndUpdate(
			{
				id: guildId,
			},
			{
				$set: {
					'welcome.embed.color': color,
					'welcome.embed.title': title,
					'welcome.embed.description': description,
					'welcome.embed.author.name': authorname,
					'welcome.embed.author.icon_url': authoricon,
					'welcome.embed.footer.text': footertext,
					'welcome.embed.footer.icon_url': footericon,
					'welcome.embed.image.url': image,
					'welcome.embed.messagecontent': messagecontent,
				},
			},
		);

		return interaction.reply({
			embeds: [
				embed
					.setTitle('Welcome Embed Updated')
					.setDescription(
						'The following embed data has been successfully saved. Some values may return a null value. This is not a bug, it just means you didn\'t provide a value for it.\n\nRun /welcome previewembed to see a preview or wait for someone to join.',
					)
					.addFields(
						{
							name: '🔹 | Color',
							value: `> ${welcome.embed.color}`,
						},
						{
							name: '🔹 | Title',
							value: `> ${welcome.embed.title}`,
						},
						{
							name: '🔹 | Description',
							value: `> ${welcome.embed.description}`,
						},
						{
							name: '🔹 | Author Name',
							value: `> ${welcome.embed.author.name}`,
						},
						{
							name: '🔹 | Author Icon',
							value: `> ${welcome.embed.author.icon_url}`,
						},
						{
							name: '🔹 | Footer Text',
							value: `> ${welcome.embed.footer.text}`,
						},
						{
							name: '🔹 | Footer Icon',
							value: `> ${welcome.embed.footer.icon_url}`,
						},
						{
							name: '🔹 | Image',
							value: `> ${welcome.embed.image.url}`,
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

		const embed = data.welcome.embed;
		const welcomeEmbed = new EmbedBuilder();
		const content = data.welcome.embed.messagecontent;
		const welcomeMessage = replacePlaceholders(content, typedMember);

		if (embed.color) {
			const hexCodeRegex = /^#[0-9A-Fa-f]{6}$/;
			if (hexCodeRegex.test(embed.color)) welcomeEmbed.setColor(embed.color);
		}

		if (embed.title) welcomeEmbed.setTitle(embed.title);

		if (embed.description)
			welcomeEmbed.setDescription(
				replacePlaceholders(embed.description, member as GuildMember) ||
					'Undefined',
			);

		if (embed.author)
			welcomeEmbed.setAuthor({
				name:
					replacePlaceholders(embed.author.name, typedMember) || 'Undefined',
				iconURL: embed.author.icon_url,
			});

		if (embed.footer)
			welcomeEmbed.setFooter({
				text:
					replacePlaceholders(embed.footer.text, typedMember) || 'Undefined',
				iconURL: embed.footer.icon_url,
			});

		if (embed.image?.url) welcomeEmbed.setImage(embed.image?.url);

		if (content)
			channel.send({
				content: welcomeMessage,
				embeds: [welcomeEmbed],
			});
		else
			channel.send({
				embeds: [welcomeEmbed],
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
		description: 'Sets the channel where welcome messages will be sent.',
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
					'welcome.channel': channel.id,
				},
			},
		);

		return interaction.reply({
			embeds: [
				embed.setDescription(
					`🔹 | Got it, welcome messages will now be sent to: <#${channel.id}>.`,
				),
			],
			ephemeral: true,
		});
	}
}
