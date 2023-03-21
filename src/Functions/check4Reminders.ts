import { Reminders as DB } from '../Structures/Schemas/reminders.js';
import { reminded } from '../Functions/reminderUtils.js';
import { Evelyn } from '../structures/Evelyn.js';
import { TextChannel } from 'discord.js';

export async function check4Reminders(client: Evelyn) {
	const data = await DB.find();

	for (let i = 0; i < data.length; i++) {
		const newData = data[i];
		if (!data) return;

		const guild = client.guilds.cache.get(newData.guildId);
		if (!guild) return;

		if (newData.hasBeenReminded === true) return;

		const channel = guild.channels?.cache.get(
			newData?.channelId,
		) as TextChannel;
		if (!channel) return;

		const message = await channel.messages.fetch(newData.messageId);
		if (!message) return;

		if (newData.scheduledTime * 1000 < Date.now()) reminded(message);
		else
			setTimeout(
				() => reminded(message),
				newData.scheduledTime * 1000 - Date.now(),
			);
	}
}
