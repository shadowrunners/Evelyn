import { OWLogs, validate } from '../../../Utils/Utils/OWLogs.js';
import { Message } from 'discord.js';
import { Evelyn } from '../../../Evelyn.js';
import { Discord, On } from 'discordx';

@Discord()
export class MessageDelete {
	@On({ event: 'messageDelete' })
	async messageDelete([message]: [Message], client: Evelyn) {
		const { guild } = message;

		if (!(await validate(guild))) return;
		const logs = new OWLogs(guild, client);

		return await logs.messageDelete(message);
	}
}
