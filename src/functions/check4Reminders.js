const DB = require('../structures/schemas/reminders.js');
const { reminded } = require('../functions/reminderUtils.js');

function check4Reminders(client) {
	DB.find().then((data) => {
		data.forEach(async () => {
			if (!data) return;

			const guild = client.guilds.cache.get(data.guildId);
			if (!guild) return;

			if (data.hasBeenReminded === true) return;

			const message = await guild.channels?.cache
				.get(data?.channelId)
				?.messages.fetch(data.messageId);
			if (!message) return;

			if (data.scheduledTime * 1000 < Date.now()) {
				reminded(message);
			}
			else {
				setTimeout(
					() => reminded(message),
					data.scheduledTime * 1000 - Date.now(),
				);
			}
		});
	});
}

module.exports = { check4Reminders };
