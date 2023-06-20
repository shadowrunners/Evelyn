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
	name: 'goodbye',
	description: 'Manage and configure goodbye messages.',
	defaultMemberPermissions: 'Administrator',
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
	})
	async manageembed(interaction: ChatInputCommandInteraction) {
		const builder = new Builder(interaction, 'goodbye');
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
