import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { Evelyn } from '../../Evelyn.js';
import { get } from 'superagent';

@Discord()
export class Catto {
	private embed: EmbedBuilder;

	constructor() {
		this.embed = new EmbedBuilder()
			.setColor('Blurple')
			.setFooter({ text: 'Powered by TheCatAPI' })
			.setTimestamp();
	}

	@Slash({
		description: 'Shows you a random cat picture.',
		name: 'cat',
	})
	async cat(interaction: ChatInputCommandInteraction, client: Evelyn) {
		const { body } = await get(
			'https://api.thecatapi.com/v1/images/search',
		).set('x-api-key', client.config.APIs.cattoKey);

		return interaction.reply({
			embeds: [this.embed.setImage(body[0].url)],
		});
	}
}
