import { UserBlacklist as UB } from '../Schemas/userBlacklist.js';
import { GuildDB as DB } from '../Schemas/guild.js';
import { ArgsOf } from 'discordx';

/** Checks to see if the user or guild who / where this command was executed is blacklisted. */
export async function isBlacklisted(
	interaction: ArgsOf<'interactionCreate'>[0],
): Promise<void> {
	const { user, guildId } = interaction;

	const userBlacklist = await UB.findOne({
		userId: user.id,
	});

	const guildData = await DB.findOne({
		id: guildId,
		blacklist: {
			isBlacklisted: true,
		},
	});

	if (userBlacklist?.isBlacklisted === true) return;
	if (guildData?.blacklist?.isBlacklisted === true) return;
}
