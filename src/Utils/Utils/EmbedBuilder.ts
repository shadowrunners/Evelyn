import {
	ActionRowBuilder,
	ChatInputCommandInteraction,
	EmbedBuilder,
	TextInputBuilder,
	TextInputStyle,
	StringSelectMenuBuilder,
	StringSelectMenuInteraction,
	StringSelectMenuOptionBuilder,
	ModalBuilder,
	ModalSubmitInteraction,
	Message,
	HexColorString,
	ButtonBuilder,
	ButtonStyle,
	ButtonInteraction,
	Embed,
} from 'discord.js';
import {
	Discord,
	SelectMenuComponent,
	ModalComponent,
	ButtonComponent,
} from 'discordx';
import { GuildDB as DB } from '../../Schemas/guild.js';

@Discord()
/** Used for creating embeds for the welcome, goodbye and ticket systems. */
export class Builder {
	/** The interaction object. */
	private interaction: ChatInputCommandInteraction;
	/** The welcome embed. Contains information about what the system does. */
	private welcomeEmbed: EmbedBuilder;
	/** The user embed that is actually customized. */
	private userEmbed: EmbedBuilder;
	/** The type of system this embed is for. */
	private type: string;

	/** Creates a new instance of the Embed Builder class. */
	constructor(interaction: ChatInputCommandInteraction, type: string) {
		this.type = type;
		this.interaction = interaction;
		this.welcomeEmbed = new EmbedBuilder()
			.setTitle('Welcome to Evelyn\'s Embed Builder')
			.setDescription(
				'These fields are all customizable by you. Use the select menu below to customize it, have fun!',
			);
		this.userEmbed = new EmbedBuilder()
			.setFooter({
				text: 'This footer is just a placeholder so Discord doesn\'t complain about it.',
			})
			.setTimestamp();
	}

	/**
	 * Updates the message with the new embed.
	 * @param message The message that will be edited.
	 * @param interaction The interaction that will be used to reply with the "Embed Updated" message.
	 * @param newEmbed The new embed that will replace the old userEmbed.
	 * @param newMessage The message that will be included alongside the embed.
	 * @returns {Promise<Message<boolean>>} The edited message.
	 */
	protected async updateMessage(
		message: Message,
		interaction: ModalSubmitInteraction,
		newEmbed: EmbedBuilder | Embed,
		newMessage?: string,
	): Promise<Message<boolean>> {
		await interaction.reply({
			content: '🔹 | Embed updated.',
			ephemeral: true,
		});

		if (newMessage)
			return message.edit({
				content: newMessage,
				embeds: [this.welcomeEmbed, newEmbed],
			});

		return message.edit({
			embeds: [this.welcomeEmbed, newEmbed],
		});
	}

	/** Checks to see if there already is an embed. */
	protected async checkForData(
		selectMenu: ActionRowBuilder<StringSelectMenuBuilder>,
		buttonMenu: ActionRowBuilder<ButtonBuilder>,
	) {
		const { guildId } = this.interaction;
		const { welcome, goodbye, tickets } = await DB.findOne({ id: guildId });
		const embed = new EmbedBuilder();

		if (!welcome || !goodbye || !tickets) return;

		switch (this.type) {
		case 'welcome':
			return this.interaction.reply({
				embeds: [
					this.welcomeEmbed,
					embed
						.setColor(welcome?.embed?.color)
						.setAuthor({
							name: welcome?.embed?.author?.name,
							iconURL: welcome?.embed?.author?.icon_url,
						})
						.setTitle(welcome?.embed?.title)
						.setDescription(
							welcome?.embed?.description ||
									'This is a placeholder since Discord doesn\'t like empty embeds. :)',
						)
						.setImage(welcome.embed?.image?.url)
						.setThumbnail(welcome.embed?.thumbnail?.url)
						.setFooter({
							text: welcome.embed?.footer?.text,
							iconURL: welcome.embed?.footer?.icon_url,
						})
						.setTimestamp(),
				],
				components: [selectMenu, buttonMenu],
			});
		case 'goodbye':
			return this.interaction.reply({
				embeds: [
					this.welcomeEmbed,
					embed
						.setColor(goodbye?.embed?.color)
						.setAuthor({
							name: goodbye?.embed?.author?.name,
							iconURL: goodbye?.embed?.author?.icon_url,
						})
						.setTitle(goodbye?.embed?.title)
						.setDescription(
							goodbye?.embed?.description ||
									'This is a placeholder since Discord doesn\'t like empty embeds. :)',
						)
						.setImage(goodbye.embed?.image?.url)
						.setThumbnail(goodbye.embed?.thumbnail?.url)
						.setFooter({
							text: goodbye.embed?.footer?.text,
							iconURL: goodbye.embed?.footer?.icon_url,
						})
						.setTimestamp(),
				],
				components: [selectMenu, buttonMenu],
			});

		case 'tickets':
			return this.interaction.reply({
				embeds: [
					this.welcomeEmbed,
					embed
						.setColor(tickets?.embed?.color)
						.setAuthor({
							name: tickets?.embed?.author?.name,
							iconURL: tickets?.embed?.author?.icon_url,
						})
						.setTitle(tickets?.embed?.title)
						.setDescription(
							tickets?.embed?.description ||
									'This is a placeholder since Discord doesn\'t like empty embeds. :)',
						)
						.setImage(tickets.embed?.image?.url)
						.setThumbnail(tickets.embed?.thumbnail?.url)
						.setFooter({
							text: tickets.embed?.footer?.text,
							iconURL: tickets.embed?.footer?.icon_url,
						})
						.setTimestamp(),
				],
				components: [selectMenu, buttonMenu],
			});
		}
	}

	/** Initializes the menus and message. */
	public async initalize() {
		const selectMenu =
			new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('welcomebuilder')
					.setPlaceholder('Select an option to customize the embed.')
					.addOptions(
						new StringSelectMenuOptionBuilder()
							.setLabel('Message Content')
							.setDescription(
								'The message that will be sent alongside the embed.',
							)
							.setValue('message'),
						new StringSelectMenuOptionBuilder()
							.setLabel('Color')
							.setDescription('The color of the embed.')
							.setValue('color'),
						new StringSelectMenuOptionBuilder()
							.setLabel('Title')
							.setDescription('The title of the embed.')
							.setValue('title'),
						new StringSelectMenuOptionBuilder()
							.setLabel('Description')
							.setDescription('The description for the embed.')
							.setValue('description'),
						new StringSelectMenuOptionBuilder()
							.setLabel('Author Name')
							.setDescription('The name for the author tag of the embed.')
							.setValue('authorName'),
						new StringSelectMenuOptionBuilder()
							.setLabel('Footer Text')
							.setDescription(
								'The text you\'d like to use for the embed\'s footer.',
							)
							.setValue('footerText'),
						new StringSelectMenuOptionBuilder()
							.setLabel('Image')
							.setDescription('The link to an image for the embed.')
							.setValue('image'),
					),
			);

		const buttonMenu = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId('saveembed')
				.setLabel('Save Embed')
				.setStyle(ButtonStyle.Success),
		);

		if (await this.checkForData(selectMenu, buttonMenu)) return;

		return this.interaction.reply({
			embeds: [this.welcomeEmbed, this.userEmbed],
			components: [selectMenu, buttonMenu],
		});
	}

	@SelectMenuComponent({
		id: 'welcomebuilder',
	})
	protected async welcomebuilder(interaction: StringSelectMenuInteraction) {
		const { values } = interaction;

		const modal = new ModalBuilder()
			.setCustomId(values[0])
			.setTitle(values[0])
			.setComponents(
				new ActionRowBuilder<TextInputBuilder>().setComponents(
					new TextInputBuilder()
						.setCustomId(values[0])
						.setLabel(values[0])
						.setStyle(TextInputStyle.Short)
						.setRequired(true)
						.setMinLength(1),
				),
			);

		console.log(values[0]);

		if (values[0].includes('authorName') || values[0].includes('footerText'))
			modal.addComponents(
				new ActionRowBuilder<TextInputBuilder>().setComponents(
					new TextInputBuilder()
						.setCustomId('iconURL')
						.setLabel('Icon URL')
						.setStyle(TextInputStyle.Paragraph)
						.setRequired(false)
						.setMinLength(1),
				),
			);

		await interaction.showModal(modal);
	}

	@ButtonComponent({
		id: 'saveembed',
	})
	protected async saveembed(interaction: ButtonInteraction) {
		const modal = new ModalBuilder()
			.setCustomId('whereshouldisave')
			.setTitle('Evelyn | Embed Saving')
			.setComponents(
				new ActionRowBuilder<TextInputBuilder>().setComponents(
					new TextInputBuilder()
						.setCustomId('inputwhatyouwantmate')
						.setLabel('What system is this embed for?')
						.setStyle(TextInputStyle.Short)
						.setPlaceholder(
							'The valid choices are tickets, welcome or goodbye.',
						)
						.setRequired(true)
						.setMinLength(1),
				),
			);

		await interaction.showModal(modal);
	}

	@ModalComponent({
		id: 'message',
	})
	protected async setMessage(interaction: ModalSubmitInteraction) {
		const { fields, message } = interaction;
		const content = fields.getTextInputValue('message');
		const embed = message.embeds[1];

		return await this.updateMessage(message, interaction, embed, content);
	}

	@ModalComponent({
		id: 'color',
	})
	protected async setColor(interaction: ModalSubmitInteraction) {
		const { fields, message } = interaction;
		const color = fields.getTextInputValue('color') as HexColorString;

		const hexCodeRegex = /^#[0-9A-Fa-f]{6}$/;

		if (!hexCodeRegex.test(color))
			return interaction.reply({
				content:
					'🔹 | The color you\'ve specified is not a valid hex color. Please provide your color in a Hex format.',
				ephemeral: true,
			});

		const embed = message.embeds[1];
		const updatedEmbed = EmbedBuilder.from(embed).setColor(color);

		return await this.updateMessage(message, interaction, updatedEmbed);
	}

	@ModalComponent({
		id: 'title',
	})
	protected async setTitle(interaction: ModalSubmitInteraction) {
		const { fields, message } = interaction;
		const title = fields.getTextInputValue('title');

		const embed = message.embeds[1];
		const updatedEmbed = EmbedBuilder.from(embed).setTitle(title);

		return await this.updateMessage(message, interaction, updatedEmbed);
	}

	@ModalComponent({
		id: 'description',
	})
	protected async setDescription(interaction: ModalSubmitInteraction) {
		const { fields, message } = interaction;
		const description = fields.getTextInputValue('description');

		const embed = message.embeds[1];
		const updatedEmbed = EmbedBuilder.from(embed).setDescription(description);

		return await this.updateMessage(message, interaction, updatedEmbed);
	}

	@ModalComponent({
		id: 'authorName',
	})
	protected async authorName(interaction: ModalSubmitInteraction) {
		const { fields, message } = interaction;
		const authorName = fields.getTextInputValue('authorName');
		const iconURL = fields.getTextInputValue('iconURL');

		const embed = message.embeds[1];

		let updatedEmbed: EmbedBuilder | Embed;

		if (iconURL)
			updatedEmbed = EmbedBuilder.from(embed).setAuthor({
				name: authorName,
				iconURL,
			});

		updatedEmbed = EmbedBuilder.from(embed).setAuthor({
			name: authorName,
		});

		return await this.updateMessage(message, interaction, updatedEmbed);
	}
	@ModalComponent({
		id: 'footerText',
	})
	protected async footerText(interaction: ModalSubmitInteraction) {
		const { fields, message } = interaction;
		const footerText = fields.getTextInputValue('footerText');
		const iconURL = fields.getTextInputValue('iconURL');

		const embed = message.embeds[1];

		let updatedEmbed: EmbedBuilder | Embed;

		if (iconURL)
			updatedEmbed = EmbedBuilder.from(embed).setFooter({
				text: footerText,
				iconURL,
			});

		updatedEmbed = EmbedBuilder.from(embed).setFooter({
			text: footerText,
		});

		return await this.updateMessage(message, interaction, updatedEmbed);
	}
	@ModalComponent({
		id: 'image',
	})
	protected async setImage(interaction: ModalSubmitInteraction) {
		const { fields, message } = interaction;
		const image = fields.getTextInputValue('image');

		const embed = message.embeds[1];
		const updatedEmbed = EmbedBuilder.from(embed).setImage(image);

		return await this.updateMessage(message, interaction, updatedEmbed);
	}

	@ModalComponent({
		id: 'whereshouldisave',
	})
	protected async whereshouldisave(interaction: ModalSubmitInteraction) {
		const { fields, guildId, message } = interaction;
		const type = fields.getTextInputValue('inputwhatyouwantmate');

		const embed = message.embeds[1];

		await DB.findOneAndUpdate(
			{
				id: guildId,
			},
			{
				$set: {
					[`${type}.embed.color`]: embed?.color,
					[`${type}.embed.title`]: embed?.title,
					[`${type}.embed.description`]: embed?.description,
					[`${type}.embed.author.name`]: embed.author?.name,
					[`${type}.embed.author.icon_url`]: embed.author?.iconURL,
					[`${type}.embed.footer.text`]: embed.footer?.text,
					[`${type}.embed.footer.icon_url`]: embed.footer?.iconURL,
					[`${type}.embed.image.url`]: embed?.image,
					[`${type}.embed.messagecontent`]: message?.content,
				},
			},
		);

		await interaction.reply({ content: '🔹 | Data saved.', ephemeral: true });

		return message.edit({
			embeds: [
				new EmbedBuilder()
					.setColor('Blurple')
					.setDescription(
						'🔹 | Embed has been successfully saved for the specified system.',
					),
			],
			components: [],
		});
	}
}
