import { OWLogs, validate } from '../../../Utils/Utils/OWLogs.js';
import { Evelyn } from '../../../Evelyn.js';
import { GuildEmoji } from 'discord.js';
import { Discord, On } from 'discordx';

@Discord()
export class EmojiDelete {
	@On({ event: 'emojiDelete' })
	async emojiDelete([emoji]: [GuildEmoji], client: Evelyn) {
		const { guild } = emoji;

		if (!(await validate(guild))) return;
		const logs = new OWLogs(guild, client);

		return await logs.emojiDelete(emoji);
	}
}
