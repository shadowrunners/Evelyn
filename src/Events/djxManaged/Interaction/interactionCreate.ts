import { isBlacklisted } from '../../../Utils/Utils/isBlacklisted.js';
import { Discord, On, ArgsOf } from 'discordx';
import { Evelyn } from '../../../Evelyn.js';

@Discord()
export class onInteraction {
	@On({ event: 'interactionCreate' })
	async onInteraction(
		[interaction]: ArgsOf<'interactionCreate'>,
		client: Evelyn,
	) {
		try {
			await isBlacklisted(interaction);
			await client.executeInteraction(interaction);
		}
		catch (err) {
			console.log(err);
		}
	}
}
