import { OWLogs, validate } from '../../../Utils/Utils/OWLogs.js';
import { Evelyn } from '../../../Evelyn.js';
import { GuildChannel } from 'discord.js';
import { Discord, On } from 'discordx';

@Discord()
export class ChannelUpdate {
	@On({ event: 'channelUpdate' })
	async channelUpdate(channels: GuildChannel, client: Evelyn) {
		const oldChannel = channels[0];
		const newChannel = channels[1];

		if (!(await validate(oldChannel.guild))) return;
		const logs = new OWLogs(oldChannel.guild, client);

		return await logs.channelUpdate(oldChannel, newChannel);
	}
}
