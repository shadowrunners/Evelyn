import { Discord, On, ArgsOf } from 'discordx';

import { Event } from '../../../interfaces/interfaces.js';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Evelyn } from '../../../Evelyn.js';
import { Util } from '../../../modules/Utils/utils.js';
import { isBlacklisted } from '../../../functions/isBlacklisted.js';

@Discord()
export class onInteraction {
	@On({ event: 'interactionCreate' })
	async onInteraction(
		[interaction]: ArgsOf<'interactionCreate'>,
		client: Evelyn,
	) {
		try {
			// if (await isBlacklisted(interaction)) return;

			await client.executeInteraction(interaction);
		}
		catch (err) {
			console.log(err);
		}
	}
}
