import { OWLogs, validate } from '../../../Utils/Utils/OWLogs.js';
import { Evelyn } from '../../../Evelyn.js';
import { GuildEmoji } from 'discord.js';
import { Discord, On } from 'discordx';

@Discord()
export class EmojiUpdate {
	@On({ event: 'emojiUpdate' })
	async emojiUpdate(emojis: GuildEmoji, client: Evelyn) {
		const oldEmoji = emojis[0] as GuildEmoji;
		const newEmoji = emojis[1] as GuildEmoji;

		if (!(await validate(oldEmoji.guild))) return;
		const logs = new OWLogs(oldEmoji.guild, client);

		return await logs.emojiUpdate(oldEmoji, newEmoji);
	}
}
