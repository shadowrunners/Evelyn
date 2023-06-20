import { validate, OWLogs } from '../../../Utils/Utils/OWLogs.js';
import { EmbedBuilder, Message } from 'discord.js';
import { Evelyn } from '../../../Evelyn.js';
import { config } from '../../../config.js';
import { Discord, On } from 'discordx';
import axios from 'axios';

@Discord()
export class PhishingShield {
	@On({ event: 'messageCreate' })
	async execute([message]: [Message], client: Evelyn) {
		const { content, guild, author } = message;
		const bodyReg = new RegExp(
			'^(?=.{1,254}$)((?!-)[A-Za-z0-9-]{1,63}(?<!-)\\.)+[A-Za-z]{2,}$',
		);

		if (bodyReg.test(content)) {
			try {
				const response = await axios.post(
					'https://anti-fish.bitflow.dev/check',
					{
						message: content,
					},
					{
						headers: {
							'User-Agent': config.userAgent,
						},
					},
				);

				if (response.status === 200 && (await validate(guild))) {
					const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
					const logs = new OWLogs(guild, client);
					const { match } = response.data;

					message.delete();

					return logs.airDrop(
						embed
							.setTitle('⚠️ | Phishing Link Detected')
							.setDescription(
								'The Anti-Phishing Shield has blocked a potentially dangerous link.',
							)
							.addFields(
								{ name: '🔹 | Posted by', value: `> ${author}` },
								{ name: '🔹 | Flagged Content', value: `> ${content}` },
								{
									name: '🔹 | Link Type',
									value: `> ${match.matches[0].type}`,
								},
							),
					);
				}
				else if (response.status === 404 && !response.data.match)
					return false;
			}
			catch (error) {
				if (error.response && error.response.status === 404) return false;
			}
		}
	}
}
