import { check4Reminders } from '../../../Utils/Checks/check4Reminders.js';
import { check4Lockdowns } from '../../../Utils/Checks/check4Lockdowns.js';
import { Evelyn } from '../../../Evelyn.js';
import { ActivityType } from 'discord.js';
import { Discord, Once } from 'discordx';
import colors from '@colors/colors';
import { set } from 'mongoose';
import DXP from 'discord-xp';
import DisStat from 'disstat';

@Discord()
export class Ready {
	@Once({
		event: 'ready',
	})
	async ready([client]: [Evelyn]) {
		const { magenta, white, green, red } = colors;
		const { user, config, manager } = client;
		const disstat = new DisStat(config.debug.statKey, client);

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

		await disstat.postData({
			servers: client.guilds.cache.size,
			users: client.users.cache.size,
		}, true);
	}
}
