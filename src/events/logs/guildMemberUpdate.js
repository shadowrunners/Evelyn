const {
  Client,
  GuildMember,
  EmbedBuilder,
  AuditLogEvent,
} = require("discord.js");
const DB = require("../../structures/schemas/guildDB.js");

module.exports = {
  name: "guildMemberUpdate",
  /**
   * @param {GuildMember} oldMember
   * @param {GuildMember} newMember
   * @param {Client} client
   */
  async execute(oldMember, newMember, client) {
    const data = await DB.findOne({
      id: oldMember.guild.id,
    });

    if (!data) return;
    if (data.logs.enabled == "false" || data.logs.channel == null) return;

    if (
      !oldMember.isCommunicationDisabled() &&
      newMember.isCommunicationDisabled()
    ) {
      const allLogs = await newMember.guild.fetchAuditLogs({
        type: AuditLogEvent.MemberUpdate,
      });
      const fetchLogs = allLogs.entries.first();

      const embed = new EmbedBuilder()
        .setAuthor({
          name: newMember.user.tag,
          iconURL: newMember.user.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(`${newMember} has been timed out.`)
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
      client.channels.cache.get(data.logs.channel).send({ embeds: [embed] });
    }
    if (
      oldMember.isCommunicationDisabled() &&
      !newMember.isCommunicationDisabled()
    ) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: newMember.user.tag,
          iconURL: newMember.user.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(`${newMember}'s timeout has been lifted.`)
        .addFields({
          name: "🔹 | Reason",
          value: `> Timeout expired!`,
        })
        .setTimestamp();
      client.channels.cache.get(data.logs.channel).send({ embeds: [embed] });
    }

    if (oldMember.user.username !== newMember.user.username) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: newMember.user.tag,
          iconURL: newMember.user.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(`${newMember}'s username has been changed.`)
        .addFields(
          {
            name: "🔹 | Old Username",
            value: `> ${oldMember.user.username}`,
          },
          {
            name: "🔹 | New Username",
            value: `> ${newMember.user.username}`,
          }
        )
        .setTimestamp();
      client.channels.cache.get(data.logs.channel).send({ embeds: [embed] });
    }

    if (
      oldMember.nickname !== newMember.nickname &&
      newMember.nickname !== null
    ) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: newMember.user.tag,
          iconURL: newMember.user.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(`${newMember}'s nickname has been changed.`)
        .addFields({
          name: "🔹 | New Nickname",
          value: `> ${newMember.nickname}`,
        })
        .setTimestamp();
      client.channels.cache.get(data.logs.channel).send({ embeds: [embed] });
    }

    if (!newMember.nickname && oldMember.nickname) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: newMember.user.tag,
          iconURL: newMember.user.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(`${newMember}'s nickname has been reset.`)
        .addFields({
          name: "🔹 | Old Nickname",
          value: `> ${oldMember.nickname}`,
        })
        .setTimestamp();
      client.channels.cache.get(data.logs.channel).send({ embeds: [embed] });
    }

    if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: newMember.user.tag,
          iconURL: newMember.user.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(`${newMember}'s roles have been updated.`)
        .addFields(
          {
            name: "🔹 | Old Roles",
            value: `> ${oldMember.roles.cache.map((r) => r.name).join(", ")}`,
          },
          {
            name: "🔹 | New Roles",
            value: `> ${newMember.roles.cache.map((r) => r.name).join(", ")}`,
          }
        )
        .setTimestamp();
      client.channels.cache.get(data.logs.channel).send({ embeds: [embed] });
    }
  },
};
