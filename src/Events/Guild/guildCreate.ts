import { Event } from '../../Interfaces/interfaces.js';
import { Evelyn } from '../../structures/Evelyn.js';
import { EmbedBuilder, WebhookClient, Guild } from 'discord.js';
import { GuildDB as DB } from '../../structures/schemas/guild.js';

const event: Event = {
	name: 'guildCreate',
	async execute(guild: Guild, client: Evelyn) {
		const { iconURL, name, memberCount, id } = guild;
		const webhook = new WebhookClient({ url: client.config.debug.watcherHook });

		await DB.create({ id: id });

		const embed = new EmbedBuilder()
			.setColor('Blurple')
			.setTitle('Guild Joined')
			.setDescription('Evelyn has been added to a new guild.')
			.setThumbnail(iconURL())
			.addFields(
				{ name: 'Name', value: `${name}` },
				{ name: 'Members', value: `${memberCount} members` },
				{ name: 'ID', value: `${id}` },
			)
			.setTimestamp();
		return webhook.send({ embeds: [embed] });
	},
};

export default event;
