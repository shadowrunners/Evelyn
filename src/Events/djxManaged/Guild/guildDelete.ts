import { WebhookClient, Guild, EmbedBuilder } from 'discord.js';
import { GuildDB as DB } from '../../../Schemas/guild.js';
import { Evelyn } from '../../../Evelyn.js';
import { Discord, On } from 'discordx';

@Discord()
export class ClearGuildData {
	@On({ event: 'guildDelete' })
	async deleteData([guild]: [Guild], client: Evelyn) {
		const { iconURL, name, memberCount, id } = guild;
		const webhook = new WebhookClient({ url: client.config.debug.watcherHook });

		await DB.findOneAndDelete({
			guildId: id,
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
	}
}
