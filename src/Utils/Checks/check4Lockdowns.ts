import { LockdownDB as DB } from '../../Schemas/lockdown.js';
import { Evelyn } from '../../Evelyn.js';
import { TextChannel } from 'discord.js';

export async function check4Lockdowns(client: Evelyn) {
	const data = await DB.find();

	for (const newData of data) {
		const guild = client.guilds.cache.get(newData.guildId);
		const channel = guild?.channels.cache.get(newData.channelId);

		if (!channel) continue;

		if (newData.timeLocked < Date.now()) {
			await DB.deleteOne({ channelId: channel.id });

			return channel.permissionOverwrites.edit(newData.guildId, {
				SendMessages: null,
			});
		}

		setTimeout(async () => {
			await DB.deleteOne({ channelId: channel.id });

			return channel.permissionOverwrites.edit(newData.guildId, {
				SendMessages: null,
			});
		}, newData.timeLocked - Date.now());
	}
}
