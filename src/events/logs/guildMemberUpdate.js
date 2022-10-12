const {
  Client,
  GuildMember,
  EmbedBuilder,
  AuditLogEvent,
} = require("discord.js");
const DB = require("../../structures/schemas/guild.js");
const { unique } = require("../../utils/utils.js");

module.exports = {
  name: "guildMemberUpdate",
  /**
   * @param {GuildMember} oldMember
   * @param {GuildMember} newMember
   * @param {Client} client
   */
  async execute(oldMember, newMember, client) {
    const { guild } = newMember;

    const data = await DB.findOne({
      id: oldMember.guild.id,
    });

    if (!data) return;
    if (data.logs.enabled == "false" || data.logs.channel === null) return;

    const allLogs = await guild.fetchAuditLogs({
      type: AuditLogEvent.MemberUpdate,
      limit: 1,
    });
    const fetchLogs = allLogs.entries.first();

    const oldRoles = oldMember.roles.cache.map((r) => r.id);
    const newRoles = newMember.roles.cache.map((r) => r.id);

    if (oldRoles.length > newRoles.length) {
      const uniqueRoles = await unique(oldRoles, newRoles);
      const role = guild.roles.cache.get(uniqueRoles[0].toString());

      const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setAuthor({
          name: newMember.user.tag,
          iconURL: newMember.user.displayAvatarURL({ dynamic: true }),
        })
        .setTitle("Member Roles Updated")
        .addFields(
          {
            name: "🔹 | Username",
            value: `> ${oldMember.user.username}`,
          },
          {
            name: "🔹 | ID",
            value: `> ${oldMember.user.id}`,
          },
          {
            name: "🔹 | Removed Role",
            value: `> <@&${role.id}>`,
          }
        );

      return client.channels.cache
        .get(data.logs.channel)
        .send({ embeds: [embed] });
    }

    if (oldRoles.length < newRoles.length) {
      const uniqueRoles = unique(oldRoles, newRoles);
      const role = guild.roles.cache.get(uniqueRoles[0].toString());

      const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setAuthor({
          name: newMember.user.tag,
          iconURL: newMember.user.displayAvatarURL({ dynamic: true }),
        })
        .setTitle("Member Roles Updated")
        .addFields(
          {
            name: "🔹 | Username",
            value: `> ${oldMember.user.username}`,
          },
          {
            name: "🔹 | ID",
            value: `> ${oldMember.user.id}`,
          },
          {
            name: "🔹 | Added Role",
            value: `> <@&${role.id}>`,
          }
        )
        .setTimestamp();

      return client.channels.cache
        .get(data.logs.channel)
        .send({ embeds: [embed] });
    }

    if (
      !oldMember.isCommunicationDisabled() &&
      newMember.isCommunicationDisabled()
    ) {
      const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setAuthor({
          name: oldMember.user.tag,
          iconURL: oldMember.user.displayAvatarURL({ dynamic: true }),
        })
        .setTitle("Member Timeout Applied")
        .addFields(
          {
            name: "🔹 | Timeout expires",
            value: `> <t:${Math.floor(
              newMember.communicationDisabledUntilTimestamp / 1000
            )}:R>`,
          },
          {
            name: "🔹 | Timed out by",
            value: `> ${fetchLogs.executor.tag} (${fetchLogs.executor.id})`,
          },
          {
            name: "🔹 | Reason",
            value: `> ${fetchLogs.reason}` || "Not provided.",
          }
        )
        .setTimestamp();
      return client.channels.cache
        .get(data.logs.channel)
        .send({ embeds: [embed] });
    }

    if (
      oldMember.isCommunicationDisabled() &&
      !newMember.isCommunicationDisabled()
    ) {
      const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setAuthor({
          name: newMember.user.tag,
          iconURL: newMember.user.displayAvatarURL({ dynamic: true }),
        })
        .setTitle("Member Timeout Removed")
        .addFields({
          name: "🔹 | Reason",
          value: `> Timeout expired!`,
        })
        .setTimestamp();
      return client.channels.cache
        .get(data.logs.channel)
        .send({ embeds: [embed] });
    }

    if (oldMember.nickname !== newMember.nickname) {
      const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setAuthor({
          name: newMember.user.tag,
          iconURL: newMember.user.displayAvatarURL({ dynamic: true }),
        })
        .setTitle("Member Nickname Changed")
        .addFields(
          {
            name: "🔹 | Old Nickname",
            value: `> ${oldMember.nickname}`,
          },
          {
            name: "🔹 | New Nickname",
            value: `> ${newMember.nickname}`,
          }
        )
        .setTimestamp();
      return client.channels.cache
        .get(data.logs.channel)
        .send({ embeds: [embed] });
    }
  },
};
