import { Event } from '../../Interfaces/interfaces.js';
import { Evelyn } from '../../structures/Evelyn.js';
import { EmbedBuilder, WebhookClient, Guild } from 'discord.js';
import { GuildDB as DB } from '../../structures/schemas/guild.js';

const event: Event = {
	name: 'guildDelete',
	async execute(guild: Guild, client: Evelyn) {
		const { iconURL, name, memberCount, id } = guild;
		const webhook = new WebhookClient({ url: client.config.debug.watcherHook });

		await DB.findOneAndDelete({
			id: id,
		});

		const embed = new EmbedBuilder()
			.setColor('Blurple')
			.setTitle('Guild Left')
			.setDescription('Evelyn has been left a guild.')
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
