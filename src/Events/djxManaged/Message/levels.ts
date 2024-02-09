import { TextChannel, Message } from 'discord.js';
import { GuildDB as DB } from '../../../Schemas/guild.js';
import { Evelyn } from '../../../Evelyn.js';
import DXP from 'discord-xp';
import { Discord, On } from 'discordx';
import { Levels } from '@/Services/Levels.js';

@Discord()
export class LevelUp {
	@On({ event: 'messageCreate' })
	async levelUp([message]: [Message], client: Evelyn) {
		const levels = new Levels();
		const { author, guild } = message;
		const data = await DB.findOne({ guildId: guild.id });

		if (!guild || author.bot || !data?.levels.enabled) return;

		const levellingChannel = client.channels.cache.get(
			data?.levels?.channel,
		) as TextChannel;
		if (!levellingChannel) return;

		const rndXP = Number(Math.floor(Math.random() * 25));
		if (rndXP === 0) return;
		console.log(`Generated XP amount! The XP amount is ${rndXP}`);

		const levelledUp = await levels.addXP(author.id, guild.id, rndXP);
		if (!levelledUp) return console.log('User didn\'t level up!');

		const user = await levels.getUser(author.id, guild.id);

		const lvlMessage = data.levels?.message
			?.replace(/{userName}/g, `${author.username}`)
			.replace(/{userMention}/g, `<@${author.id}>`)
			.replace(/{userLevel}/g, `${user.level}`);

		return levellingChannel.send({ content: `${lvlMessage}` });
	}
}