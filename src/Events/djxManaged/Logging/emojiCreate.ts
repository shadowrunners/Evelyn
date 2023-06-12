import { OWLogs, validate } from '../../../Utils/Utils/OWLogs.js';
import { Evelyn } from '../../../Evelyn.js';
import { GuildEmoji } from 'discord.js';
import { Discord, On } from 'discordx';

@Discord()
export class EmojiCreate {
	@On({ event: 'emojiCreate' })
	async emojiCreate([emoji]: [GuildEmoji], client: Evelyn) {
		const { guild, name, id } = emoji;

		if (!(await validate(guild))) return;

		const fetchLogs = await guild.fetchAuditLogs<AuditLogEvent.EmojiCreate>({
			limit: 1,
		});
		const firstLog = fetchLogs.entries.first();

		const embed = new EmbedBuilder()
			.setColor('Blurple')
			
			)
			.setTimestamp();

		return dropOffLogs(guild, client, embed);
	}
}
