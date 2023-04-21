import { Event } from '../../interfaces/interfaces.js';
import { TextChannel, Message } from 'discord.js';
import { GuildDB as DB } from '../../structures/schemas/guild.js';
import { Evelyn } from '../../structures/Evelyn.js';
import DXP from 'discord-xp';

const event: Event = {
	name: 'messageCreate',
	async execute(message: Message, client: Evelyn) {
		const { author, guild } = message;
		const data = await DB.findOne({ id: guild.id });

		if (!guild || author.bot) return;
		if (!data?.levels.enabled || !data?.levels.channel || !data?.levels.message)
			return;

		const levellingChannel = client.channels.cache.get(
			data?.levels.channel,
		) as TextChannel;
		if (!levellingChannel) return;

		const rndXP = Number(Math.floor(Math.random() * 25));
		if (rndXP === 0) return;

		const levelledUp = await DXP.appendXp(author.id, guild.id, rndXP);

		if (levelledUp) {
			const user = await DXP.fetch(author.id, guild.id);

			const lvlMessage = data.levels?.message
				?.replace(/{userTag}/g, `${author.username}#${author.tag}`)
				.replace(/{userName}/g, `${author.username}`)
				.replace(/{userMention}/g, `<@${author.id}>`)
				.replace(/{userLevel}/g, `${user.level}`);

			if (levellingChannel)
				return levellingChannel.send({ content: `${lvlMessage}` });
		}
	},
};

export default event;
