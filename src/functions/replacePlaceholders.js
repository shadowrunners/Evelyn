/** This function replaces the tags (i.e: ${userTag}) used in the welcome and goodbye systems. */

function replacePlaceholders(string, member) {
  return string
    ?.replace(/{userTag}/g, member.user.tag)
    .replace(/{userName}/g, member.user.username)
    .replace(/{userID}/g, member.user.id)
    .replace(/{userMention}/g, `<@${member.user.id}>`)
    .replace(/{guildName}/g, member.guild.name)
    .replace(/{memberCount}/g, member.guild.memberCount);
}

module.exports = { replacePlaceholders };
