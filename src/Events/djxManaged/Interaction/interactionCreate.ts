import { isBlacklisted } from '../../../Utils/Helpers/isBlacklisted.js';
// import { captureException } from '@sentry/browser';
import { Discord, On, ArgsOf } from 'discordx';
import { Evelyn } from '../../../Evelyn.js';

@Discord()
export class OnInteraction {
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
			// return captureException(err);
		}
	}
}
