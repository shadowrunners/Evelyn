import { OWLogs, validate } from '../../../Utils/Utils/OWLogs.js';
import { Evelyn } from '../../../Evelyn.js';
import { GuildChannel } from 'discord.js';
import { Discord, On } from 'discordx';

@Discord()
export class ChannelDelete {
	@On({ event: 'channelDelete' })
	async channelDelete([channel]: [GuildChannel], client: Evelyn) {
		const { guild } = channel;

		if (!(await validate(guild))) return;
		const logs = new OWLogs(guild, client);

		return await logs.channelDelete(channel);
	}
}
