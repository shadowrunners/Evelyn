import { LockdownDB as DB } from '../Schemas/lockdown.js';
import { Evelyn } from '../Evelyn.js';
import { TextChannel } from 'discord.js';

export async function check4Lockdowns(client: Evelyn) {
	const data = await DB.find();

	for (let i = 0; i < data.length; i++) {
		const newData = data[i];
		if (!newData) return;

		const channel = client.guilds.cache
			.get(newData.guildId)
			.channels.cache.get(newData.channelId) as TextChannel;
		if (!channel) return;

		if (newData.timeLocked < Date.now()) {
			await DB.deleteOne({ channelId: channel.id });

			return channel.permissionOverwrites.edit(newData.guildId, {
				SendMessages: null,
			});
		}

		setTimeout(async () => {
			await DB.deleteOne({ ChannelID: channel.id });

			return channel.permissionOverwrites.edit(newData.guildId, {
				SendMessages: null,
			});
		}, newData.timeLocked - Date.now());
	}
}
