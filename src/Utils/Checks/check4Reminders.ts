import { Reminders as DB } from '../../Schemas/reminders.js';
import { reminded } from '../Utils/reminderUtils.js';
import { Evelyn } from '../../Evelyn.js';
import { TextChannel } from 'discord.js';

/** Checks to see if all users have been reminded. */
export async function check4Reminders(client: Evelyn) {
	const data = await DB.find();

	for (const newData of data) {
		const guild = client.guilds.cache.get(newData.guildId);
		if (!guild || newData.hasBeenReminded) continue;
		
		const channel = guild.channels.cache.get(newData.channelId) as TextChannel;
		if (!channel) continue;
		
		const message = await channel.messages.fetch(newData.messageId);
		if (!message) continue;
		
		const timeDifference = newData.scheduledTime * 1000 - Date.now();
		if (timeDifference <= 0) await reminded(message);
		else setTimeout(async () => {
			await reminded(message);
		}, timeDifference);
	}
}

