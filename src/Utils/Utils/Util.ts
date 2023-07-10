/** This class contains a couple utilities used by Evelyn across systems. */
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	ChatInputCommandInteraction,
} from 'discord.js';

export class Util {
	private interaction: ChatInputCommandInteraction | undefined;

	/** Creates a new instance of the Util class. */
	constructor(interaction?: ChatInputCommandInteraction) {
		/** The interaction object. */
		this.interaction = interaction ?? undefined;
	}

	/** Turns several embeds into pages. */
	public async embedPages(embeds: EmbedBuilder[]) {
		const pages = {};
		const getRow = (id: string) => {
			return new ActionRowBuilder<ButtonBuilder>().addComponents(
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
		});

		const filter = (i) => i.user.id === this.interaction.user.id;
		const time = 1000 * 60 * 5;

		const collector = replyEmbed.createMessageComponentCollector({
			filter,
			time,
		});

		collector.on('collect', async (b) => {
			if (!b) return;
			if (b.customId !== 'prev_embed' && b.customId !== 'next_embed') return;

			b.deferUpdate();

			if (b.customId === 'prev_embed' && pages[id] > 0) {
				--pages[id];
			}
			else if (b.customId === 'next_embed' && pages[id] < embeds.length - 1) {
				++pages[id];
			}

			embeds[pages[id]].setFooter({
				text: `Page ${pages[id] + 1} of ${Pagemax}`,
			});

			await this.interaction.editReply({
				embeds: [embeds[pages[id]]],
				components: [getRow(id)],
			});
		});
	}

	/** Determines the value of the current database connection status. */
	public switchTo(val: number) {
		switch (val) {
		case 0:
			return '🟥 Disconnected';
		case 1:
			return '🔷 Connected';
		case 2:
			return '🟨 Connecting';
		case 3:
			return '🟨 Disconnecting';
		default:
			break;
		}
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

	/** Converts a string of numbers into a unix timestamp. */
	public convertToUnixTimestamp(num: number): number {
		const timestamp = Math.floor(num / 1000);
		return timestamp;
	}

	/** What is my purpose? To capitalize the first letter of the status. */
	public capitalizePresence(presence: string) {
		switch (presence) {
		case 'online':
			return 'Online';
		case 'dnd':
			return 'Do Not Disturb';
		case 'idle':
			return 'Idle';
		case 'offline':
			return 'Offline';
		default:
			return presence;
		}
	}

	/** Converts time to milliseconds. */
	public msToTime(time: string): number {
		const timeUnits: TimeUnit[] = [
			{ name: 'ms', pluralName: 'ms', ms: 1 },
			{ name: 's', pluralName: 's', ms: 1000 },
			{ name: 'm', pluralName: 'm', ms: 1000 * 60 },
			{ name: 'h', pluralName: 'h', ms: 1000 * 60 * 60 },
			{ name: 'd', pluralName: 'd', ms: 1000 * 60 * 60 * 24 },
		];

		const regex = /^\s*(\d+)\s*(ms|s|m|h|d)?\s*$/i;
		const match = regex.exec(time.trim());
		  
		const value = parseInt(match[1], 10);
		const unitName = match[2] || 'ms';
		const unit = timeUnits.find((timeUnit) =>
			timeUnit.name === unitName || timeUnit.pluralName === unitName
		);
		  
		return value * unit.ms;
	}
}

interface TimeUnit {
	name: string;
	pluralName: string;
	ms: number;
  }
  
