import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	ChannelType,
	TextChannel,
	GuildMember,
} from 'discord.js';
import { Discord, SlashGroup, Slash, SlashChoice, SlashOption } from 'discordx';
import { replacePlaceholders } from '../../Utils/Utils/replacePlaceholders.js';
import { Builder } from '../../Utils/Utils/EmbedBuilder.js';
import { GuildDB as DB } from '../../Schemas/guild.js';

@Discord()
@SlashGroup({
	name: 'welcome',
	description: 'Manage and configure welcome messages.',
	defaultMemberPermissions: 'Administrator',
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
					'welcome.enabled': choice === 'enable',
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
	})
	async manageembed(interaction: ChatInputCommandInteraction) {
		const builder = new Builder(interaction, 'welcome');
		return await builder.initalize();
	}

	@Slash({
		name: 'previewembed',
		description: 'Sends a preview of the embed.',
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
