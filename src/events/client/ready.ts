import { ActivityType } from 'discord.js';
import { magenta, white, green, red } from 'chalk';
import { Event } from "../../interfaces/interfaces"
import { loadCommands } from '../../structures/handlers/commands.js';
//import { check4Giveaways } from '../../functions/check4Giveaways.js';
///import { check4Reminders } from '../../functions/check4Reminders.js';
//import { check4Lockdowns } from '../../functions/check4Lockdowns.js';
import { set } from 'mongoose';
import DXP from 'discord-xp';
import { Evelyn } from '../../structures/Evelyn';

export const event: Event = {
	name: "ready",
	once: true,
	execute(client: Evelyn) {
		loadCommands(client);

		console.log(
			`${magenta('Discord API')} ${white('· Logged in as')} ${green(
				`${client.user.tag}`,
			)}`,
		);

		client.user.setPresence({
			activities: [
				{
					name: 'Floating in the Cyberspace | @me for info',
					type: ActivityType.Streaming,
				},
			],
		});

		if (!client.config.database) {
			return console.error(
				`${magenta('Evelyn Notification')} ${white('·')} ${red(
					'Couldn\'t connect to database, please check your config.json file.',
				)}`,
			);
		}

		client.statcord.autopost();
		client.manager.init(client);

		set('strictQuery', true)
			.connect(client.config.database)
			.then(() => {
				console.log(
					`${magenta('Database')} ${white('·')} ${green(
						`${client.user.username}`,
					)} ${white('has successfully connected to the database.')}`,
				);
			})
			.catch((err) => {
				console.log(err);
			});

		//check4Giveaways(client);
		//check4Reminders(client);
		//check4Lockdowns(client);
		DXP.setURL(client.config.database);
	}
}