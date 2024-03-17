import { ButtonInteraction, ChatInputCommandInteraction, CommandInteraction, ContextMenuCommandInteraction, StringSelectMenuInteraction } from 'discord.js';
import { UserBlacklists as UB, Guilds as DB } from '@Schemas';
import { GuardFunction, ArgsOf } from 'discordx';

/** Checks to see if the bot is playing anything. */
export const IsBlacklisted: GuardFunction<ArgsOf<'interactionCreate'>> = async (interaction, _client, next) => {
	if (
		interaction instanceof CommandInteraction ||
        interaction instanceof ChatInputCommandInteraction ||
		interaction instanceof ButtonInteraction ||
        interaction instanceof StringSelectMenuInteraction ||
        interaction instanceof ContextMenuCommandInteraction
	) {
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

		if (
			userBlacklist?.isBlacklisted === true ||
			guildData?.blacklist?.isBlacklisted === true
		) return;

		next();
	}
};

