// eslint-disable-next-line no-unused-vars
const { GuildMember } = require('discord.js');

/**
 * This function replaces the tags (i.e: ${userTag}) used in the welcome and goodbye systems.
 * @param {String} string - The string passed to the author, message content etc.
 * @param {GuildMember} member - The member object used for replacing user related info.
 */
function replacePlaceholders(string, member) {
	const { user, guild } = member;

	return string
		?.replace(/{userTag}/g, user.tag)
		?.replace(/{userName}/g, user.username)
		?.replace(/{userID}/g, user.id)
		?.replace(/{userMention}/g, `<@${user.id}>`)
		?.replace(/{guildName}/g, guild.name)
		?.replace(/{memberCount}/g, guild.memberCount);
}

module.exports = { replacePlaceholders };
