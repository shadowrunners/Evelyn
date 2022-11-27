const { Client, GuildMember, EmbedBuilder } = require("discord.js");
const DB = require("../../structures/schemas/guild.js");
const { unique } = require("../../functions/utils.js");

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
    if (data.logs.enabled === false || data.logs.channel === "") return;

    const logsChannel = client.channels.cache.get(data.logs?.channel);
    if (!logsChannel) return;

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
        );

      return logsChannel.send({ embeds: [embed] });
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
        .setTimestamp();

      return logsChannel.send({ embeds: [embed] });
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
        .setTimestamp();
      return logsChannel.send({ embeds: [embed] });
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
        .setTimestamp();
      return logsChannel.send({ embeds: [embed] });
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
        .setTimestamp();
      return logsChannel.send({ embeds: [embed] });
    }
  },
};
