import { check4Reminders } from '../../../Utils/Checks/check4Reminders.js';
import { check4Lockdowns } from '../../../Utils/Checks/check4Lockdowns.js';
import { Evelyn } from '../../../Evelyn.js';
import { ActivityType } from 'discord.js';
import { Discord, Once } from 'discordx';
import colors from '@colors/colors';
import { set } from 'mongoose';
import DXP from 'discord-xp';

@Discord()
export class ready {
	@Once({
		event: 'ready',
	})
	async ready([client]: [Evelyn]) {
		const { magenta, white, green, red } = colors;
		const { user, config, statcord, manager } = client;

		console.info(
			`${magenta('Discord API')} ${white('· Logged in as')} ${green(
				`${client.user.tag}`,
			)}`,
		);

		user.setPresence({
			activities: [
				{
					name: 'it\'s morbin time baby :)',
					type: ActivityType.Streaming,
				},
			],
		});

		if (!config.database) {
			return console.error(
				`${magenta('Evelyn Notification')} ${white('·')} ${red(
					'Couldn\'t connect to database, please check your config.ts file.',
				)}`,
			);
		}

		client.initApplicationCommands();
		statcord.autopost();
		manager.init(client);

		await set('strictQuery', false)
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

		await check4Reminders(client);
		await check4Lockdowns(client);
		await DXP.setURL(client.config.database);
	}
}
