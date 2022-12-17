const { webhookDelivery } = require("../../functions/webhookDelivery.js");
const { GuildMember, EmbedBuilder } = require("discord.js");
const DB = require("../../structures/schemas/guild.js");

module.exports = {
  name: "guildMemberUpdate",
  /**
   * @param {GuildMember} oldMember
   * @param {GuildMember} newMember
   */
  async execute(oldMember, newMember) {
    const { guild } = newMember;

    const data = await DB.findOne({
      id: oldMember.guild.id,
    });

    if (!data || !data.logs.enabled || !data.logs.channel || !data.logs.webhook)
      return;

    const oldRoles = oldMember.roles.cache.map((r) => r.id);
    const newRoles = newMember.roles.cache.map((r) => r.id);

    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    if (oldRoles.length > newRoles.length) {
      const uniqueRoles = await unique(oldRoles, newRoles);
      const role = guild.roles.cache.get(uniqueRoles[0].toString());

      return webhookDelivery(
        data,
        embed
          .setAuthor({
            name: newMember.user.tag,
            iconURL: newMember.user.displayAvatarURL({ dynamic: true }),
          })
          .setTitle("Member Roles Updated")
          .addFields(
            {
              name: "🔹 | Username",
              value: `> ${oldMember.user.username}`,
              inline: true,
            },
            {
              name: "🔹 | ID",
              value: `> ${oldMember.user.id}`,
              inline: true,
            },
            {
              name: "🔹 | Removed Role",
              value: `> <@&${role.id}>`,
              inline: true,
            }
          )
      );
    }

    if (oldRoles.length < newRoles.length) {
      const uniqueRoles = unique(oldRoles, newRoles);
      const role = guild.roles.cache.get(uniqueRoles[0].toString());

      return webhookDelivery(
        data,
        embed
          .setAuthor({
            name: newMember.user.tag,
            iconURL: newMember.user.displayAvatarURL({ dynamic: true }),
          })
          .setTitle("Member Roles Updated")
          .addFields(
            {
              name: "🔹 | Username",
              value: `> ${oldMember.user.username}`,
              inline: true,
            },
            {
              name: "🔹 | ID",
              value: `> ${oldMember.user.id}`,
              inline: true,
            },
            {
              name: "🔹 | Added Role",
              value: `> <@&${role.id}>`,
              inline: true,
            }
          )
      );
    }

    if (
      !oldMember.isCommunicationDisabled() &&
      newMember.isCommunicationDisabled()
    )
      return webhookDelivery(
        data,
        embed
          .setAuthor({
            name: oldMember.user.tag,
            iconURL: oldMember.user.displayAvatarURL({ dynamic: true }),
          })
          .setTitle("Member Timeout Applied")
          .addFields(
            {
              name: "🔹 | Username",
              value: `> ${newMember.user.username}`,
              inline: true,
            },
            {
              name: "🔹 | ID",
              value: `> ${newMember.user.id}`,
              inline: true,
            },
            {
              name: "🔹 | Timeout expires",
              value: `> <t:${Math.floor(
                newMember.communicationDisabledUntilTimestamp / 1000
              )}:R>`,
            }
          )
      );

    if (
      oldMember.isCommunicationDisabled() &&
      !newMember.isCommunicationDisabled()
    )
      return webhookDelivery(
        data,
        embed
          .setAuthor({
            name: newMember.user.tag,
            iconURL: newMember.user.displayAvatarURL({ dynamic: true }),
          })
          .setTitle("Member Timeout Removed")
          .addFields(
            {
              name: "🔹 | Username",
              value: `> ${newMember.user.username}`,
              inline: true,
            },
            {
              name: "🔹 | ID",
              value: `> ${newMember.user.id}`,
              inline: true,
            },
            {
              name: "🔹 | Reason",
              value: `> Timeout expired!`,
              inline: true,
            }
          )
      );

    if (oldMember.nickname !== newMember.nickname)
      return webhookDelivery(
        data,
        embed
          .setAuthor({
            name: newMember.user.tag,
            iconURL: newMember.user.displayAvatarURL({ dynamic: true }),
          })
          .setTitle("Member Nickname Changed")
          .addFields(
            {
              name: "🔹 | Username",
              value: `> ${newMember.user.username}`,
              inline: true,
            },
            {
              name: "🔹 | ID",
              value: `> ${newMember.user.id}`,
              inline: true,
            },
            {
              name: "🔹 | Old Nickname",
              value: `> ${oldMember.nickname}`,
              inline: true,
            },
            {
              name: "🔹 | New Nickname",
              value: `> ${newMember.nickname}`,
              inline: true,
            }
          )
      );
  },
};

function unique(arr1, arr2) {
  const unique1 = arr1.filter((z) => arr2.indexOf(z) === -1);
  const unique2 = arr2.filter((z) => arr1.indexOf(z) === -1);

  return unique1.concat(unique2);
}
