import { Reminders as DB } from '../../Schemas/reminders.js';
import { reminded } from '../Utils/reminderUtils.js';
import { Evelyn } from '../../Evelyn.js';
import { TextChannel } from 'discord.js';

/** Checks to see if all users have been reminded. */
export async function check4Reminders(client: Evelyn) {
	const data = await DB.find();

	for (let i = 0; i < data.length; i++) {
		const newData = data[i];
		if (!data) return;

		const guild = client.guilds.cache.get(newData.guildId);
		if (!guild) return;

		if (newData.hasBeenReminded === false) {
			const channel = guild.channels?.cache.get(
				newData?.channelId,
			) as TextChannel;
			if (!channel) return;

			const message = await channel.messages.fetch(newData.messageId);
			if (!message) return;

			if (newData.scheduledTime * 1000 < Date.now()) await reminded(message);
			else
				setTimeout(
					() => reminded(message),
					newData.scheduledTime * 1000 - Date.now(),
				);
		}
	}
}
