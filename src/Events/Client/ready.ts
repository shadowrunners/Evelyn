import { ActivityType } from 'discord.js';
import { magenta, white, green, red } from '@colors/colors';
import { loadCommands } from '../../structures/handlers/commands.js';
// import { check4Giveaways } from '../../functions/check4Giveaways.js';
import { check4Reminders } from '../../functions/check4Reminders.js';
// import { check4Lockdowns } from '../../functions/check4Lockdowns.js';
import { set } from 'mongoose';
import DXP from 'discord-xp';
import { Evelyn } from '../../structures/Evelyn.js';
import { Event } from '../../interfaces/interfaces.js';

const event: Event = {
	name: 'ready',
	once: true,
	execute(client: Evelyn) {
		loadCommands(client);

		const { user, config, statcord, manager } = client;

		console.info(
			`${magenta('Discord API')} ${white('· Logged in as')} ${green(
				`${client.user.tag}`,
			)}`,
		);

		user.setPresence({
			activities: [
				{
					name: 'Floating in the Cyberspace | @me for info',
					type: ActivityType.Streaming,
				},
			],
		});

		if (!config.database) {
			return console.error(
				`${magenta('Evelyn Notification')} ${white('·')} ${red(
					'Couldn\'t connect to database, please check your config.json file.',
				)}`,
			);
		}

		statcord.autopost();
		manager.init(client);

		set('strictQuery', true)
			.connect(config.database)
			.then(() => {
				console.info(
					`${magenta('Database')} ${white('·')} ${green(
						`${client.user.username}`,
					)} ${white('has successfully connected to the database.')}`,
				);
			})
			.catch((err) => {
				console.log(err);
			});

		// check4Giveaways(client);
		check4Reminders(client);
		// check4Lockdowns(client);
		DXP.setURL(client.config.database);
	},
};

export default event;
