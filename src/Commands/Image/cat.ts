import {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	PermissionFlagsBits,
	EmbedBuilder,
} from 'discord.js';
import { Command } from '../../Interfaces/interfaces.js';
import { Evelyn } from '../../structures/Evelyn.js';
import { get } from 'superagent';

const { SendMessages, EmbedLinks } = PermissionFlagsBits;

const command: Command = {
	botPermissions: [SendMessages, EmbedLinks],
	data: new SlashCommandBuilder()
		.setName('cat')
		.setDescription('Shows you a random cat picture.'),
	async execute(interaction: ChatInputCommandInteraction, client: Evelyn) {
		const { body } = await get(
			'https://api.thecatapi.com/v1/images/search',
		).set('x-api-key', client.config.APIs.cattoKey);
		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor('Blurple')
					.setImage(body[0].url)
					.setTimestamp(),
			],
		});
	},
};

export default command;
