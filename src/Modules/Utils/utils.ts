/** This class contains a couple utilities used by Evelyn across systems. */
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	PermissionsBitField,
	EmbedBuilder,
	ChatInputCommandInteraction,
	InteractionEditReplyOptions,
} from 'discord.js';

export class Util {
	private interaction: ChatInputCommandInteraction;

	/** Creates a new instance of the Util class. */
	constructor(interaction?: ChatInputCommandInteraction) {
		/** The interaction object. */
		this.interaction = interaction;
	}

	/** Turns several embeds into pages. */
	public async embedPages(embeds: EmbedBuilder[]) {
		const pages = {};
		const getRow = (id: string) => {
			const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
				new ButtonBuilder()
					.setLabel('◀')
					.setCustomId('prev_embed')
					.setStyle(ButtonStyle.Primary)
					.setDisabled(pages[id] === 0),

				new ButtonBuilder()
					.setLabel('▶')
					.setCustomId('next_embed')
					.setStyle(ButtonStyle.Primary)
					.setDisabled(pages[id] === embeds.length - 1),
			);
			return row;
		};

		const id = this.interaction.user.id;
		pages[id] = pages[id] || 0;
		const Pagemax = embeds.length;

		const embed = embeds[pages[id]];
		embeds[pages[id]].setFooter({
			text: `Page ${pages[id] + 1} from ${Pagemax}`,
		});

		const replyEmbed = await this.interaction.editReply({
			embeds: [embed],
			components: [getRow(id)],
			fetchReply: true,
		} as InteractionEditReplyOptions);

		const collector = replyEmbed.createMessageComponentCollector({
			filter: (i) => i.user.id === this.interaction.user.id,
			time: 1000 * 60 * 5,
		});

		collector.on('collect', async (b) => {
			if (!b) return;
			if (b.customId !== 'prev_embed' && b.customId !== 'next_embed') return;

			b.deferUpdate();

			if (b.customId === 'prev_embed' && pages[id] > 0) --pages[id];
			else if (b.customId === 'next_embed' && pages[id] < embeds.length - 1)
				++pages[id];

			embeds[pages[id]].setFooter({
				text: `Page ${pages[id] + 1} of ${Pagemax}`,
			});

			await this.interaction.editReply({
				embeds: [embeds[pages[id]]],
				components: [getRow(id)],
				fetchReply: true,
			} as InteractionEditReplyOptions);
		});
	}

	/** Determines the value of the current database connection status. */
	public switchTo(val: number) {
		let status: string;
		switch (val) {
		case 0:
			return (status = '🟥 Disconnected');
		case 1:
			return (status = '🔷 Connected');
		case 2:
			return (status = '🟨 Connecting');
		case 3:
			return (status = '🟨 Disconnecting');
		default:
			break;
		}
		return status;
	}

	/** Checks to see if the bot has a certain permission. */
	public checkPermissions(command) {
		const { guild } = this.interaction;

		if (
			guild.members.me.permissions.has(
				PermissionsBitField.resolve(command.botPermissions),
			)
		)
			return;

		const permission = PermissionsBitField.resolve(command.botPermissions);

		return this.interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor('Blurple')
					.setTitle('Missing Permissions')
					.setDescription(
						'🔹 | I\'m missing several permissions, might wanna have a look at that.',
					)
					.addFields({
						name: 'Permissions Missing',
						value: `${permission}`,
					}),
			],
			ephemeral: true,
		});
	}

	/** Converts time from ms to a readable format. */
	public formatTime(duration: number): string {
		const ms = duration % 1000;
		duration = (duration - ms) / 1000;
		const secs = duration % 60;
		duration = (duration - secs) / 60;
		const mins = duration % 60;
		const hrs = (duration - mins) / 60;

		let formatted = '';
		if (hrs > 0) formatted += hrs + 'h ';
		if (mins > 0) formatted += mins + 'm ';
		if (secs > 0) formatted += secs + 's ';
		return formatted.trim();
	}
}
