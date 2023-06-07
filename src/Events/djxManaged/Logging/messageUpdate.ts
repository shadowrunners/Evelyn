import { dropOffLogs, validate } from '../../../Utils/Utils/dropOffLogs.js';
import {
	Message,
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} from 'discord.js';
import { Evelyn } from '../../../Evelyn.js';
import { Discord, On } from 'discordx';

@Discord()
export class MessageUpdate {
	@On({ event: 'messageUpdate' })
	async messageUpdate(message: Message, client: Evelyn) {
		const oldMessage = message[0] as Message;
		const newMessage = message[1] as Message;

		if (oldMessage.author?.bot && !(await validate(oldMessage.guild))) return;

		const embed = new EmbedBuilder().setColor('Blurple');
		const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setLabel('Jump to Message')
				.setStyle(ButtonStyle.Link)
				.setURL(oldMessage?.url),
		);

		if (oldMessage.content !== newMessage.content)
			return dropOffLogs(
				oldMessage.guild,
				client,
				embed
					.setAuthor({
						name: oldMessage.guild.name,
						iconURL: oldMessage.guild.iconURL(),
					})
					.setTitle('Message Updated')
					.addFields(
						{
							name: '🔹 | Old Content',
							value: `> ${oldMessage.content}`,
						},
						{
							name: '🔹 | New Content',
							value: `> ${newMessage.content}`,
						},
						{
							name: '🔹 | Message ID',
							value: `> ${oldMessage.id}`,
						},
						{
							name: '🔹 | Message updated by',
							value: `> ${newMessage.author}`,
						},
					)
					.setTimestamp(),
				actionRow,
			);
	}
}
