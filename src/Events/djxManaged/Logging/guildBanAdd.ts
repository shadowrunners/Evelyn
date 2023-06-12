import { OWLogs, validate } from '../../../Utils/Utils/OWLogs.js';
import { Evelyn } from '../../../Evelyn.js';
import { GuildBan } from 'discord.js';
import { Discord, On } from 'discordx';

@Discord()
export class GuildBanAdd {
	@On({ event: 'guildBanAdd' })
	async guildBanAdd([ban]: [GuildBan], client: Evelyn) {
		const { guild } = ban;

		if (!(await validate(guild))) return;
		const logs = new OWLogs(guild, client);

		return await logs.guildBanAdd(ban);
	}
}
