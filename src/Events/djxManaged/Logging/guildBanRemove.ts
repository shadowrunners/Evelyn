import { OWLogs, validate } from '../../../Utils/Utils/OWLogs.js';
import { Evelyn } from '../../../Evelyn.js';
import { Discord, On } from 'discordx';
import { GuildBan } from 'discord.js';

@Discord()
export class GuildBanRemove {
	@On({ event: 'guildBanRemove' })
	async guildBanRemove([ban]: [GuildBan], client: Evelyn) {
		const { guild } = ban;

		if (!(await validate(guild))) return;
		const logs = new OWLogs(guild, client);

		return await logs.guildBanRemove(ban);
	}
}
