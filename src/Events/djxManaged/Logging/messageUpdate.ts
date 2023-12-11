import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message } from 'discord.js';
import { send, validate } from '../../../Utils/Helpers/loggerUtils.js';
import { Evelyn } from '../../../Evelyn.js';
import { Discord, On } from 'discordx';

@Discord()
export class MessageUpdate {
	@On({ event: 'messageUpdate' })
	async messageUpdate(message: Message[], client: Evelyn) {
		const oldMessage = message[0];
		const newMessage = message[1];

		if (oldMessage.author?.bot && !(await validate(oldMessage.guildId))) return;

		const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setLabel('Jump to Message')
				.setStyle(ButtonStyle.Link)
				.setURL(oldMessage?.url),
		);

		const embed = new EmbedBuilder()
			.setColor('Blurple')
			.setAuthor({
				name: oldMessage.guild.name,
				iconURL: oldMessage.guild.iconURL(),
			})
			.setTitle('Message Updated')
			.addFields({
				name: '🔹 | Old Content',
				value: `> ${oldMessage.content}`,
			},
			{
				name: '🔹 | New Content',
				value: `> ${newMessage.content}`,
			},
			{
				name: '🔹 | ID',
				value: `> ${oldMessage.id}`,
			},
			{
				name: '🔹 | Updated by',
				value: `> ${newMessage.author}>`,
			},
			)
			.setTimestamp();

		if (oldMessage.content !== newMessage.content)
			return await send({
				guild: oldMessage.guildId,
				client,
				embed,
				components: actionRow,
			});
	}
}
