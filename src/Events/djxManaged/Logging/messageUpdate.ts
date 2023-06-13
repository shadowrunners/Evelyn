import { OWLogs, validate } from '../../../Utils/Utils/OWLogs.js';
import { Message } from 'discord.js';
import { Evelyn } from '../../../Evelyn.js';
import { Discord, On } from 'discordx';

@Discord()
export class MessageUpdate {
	@On({ event: 'messageUpdate' })
	async messageUpdate(message: Message, client: Evelyn) {
		const oldMessage = message[0];
		const newMessage = message[1];

		if (oldMessage.author?.bot && !(await validate(oldMessage.guild))) return;
		const logs = new OWLogs(oldMessage.guild, client);

		return await logs.messageUpdate(oldMessage, newMessage);
	}
}
