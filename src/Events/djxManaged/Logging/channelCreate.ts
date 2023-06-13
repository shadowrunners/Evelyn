import { OWLogs, validate } from '../../../Utils/Utils/OWLogs.js';
import { Evelyn } from '../../../Evelyn.js';
import { GuildChannel } from 'discord.js';
import { Discord, On } from 'discordx';

@Discord()
export class ChannelCreate {
	@On({ event: 'channelCreate' })
	async channelCreate([channel]: [GuildChannel], client: Evelyn) {
		const { guild } = channel;

		if (!(await validate(guild))) return;
		const logs = new OWLogs(guild, client);

		return await logs.channelCreate(channel);
	}
}
