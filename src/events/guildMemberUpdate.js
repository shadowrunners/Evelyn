const { Client, GuildMember, MessageEmbed } = require("discord.js");
const MDB = require("../../structures/schemas/logsDB.js");

/**
 * @param {GuildMember} oldMember
 * @param {GuildMember} newMember
 * @param {Client} client
 */

module.exports = async (client, oldMember, newMember) => {
    const guild = oldMember.guild;

    const data = await MDB.findOne({
        Guild: guild.id,
    })

    if (!data) return;

    if (!oldMember.isCommunicationDisabled() && newMember.isCommunicationDisabled()) {
        const allLogs = await newMember.guild.fetchAuditLogs({ type: "MEMBER_UPDATE" });
        const fetchLogs = allLogs.entries.first();

        const embed = new MessageEmbed()
            .setAuthor({ name: newMember.user.tag, iconURL: newMember.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`${newMember} has been timed out.`)
            .addFields(
                {
                    name: "Timeout expires",
                    value: `<t:${Math.floor(newMember.communicationDisabledUntilTimestamp / 1000)}:R>`
                },
                {
                    name: "Timed out by",
                    value: `${fetchLogs.executor.tag} (${fetchLogs.executor.id})`
                },
                {
                    name: "Reason",
                    value: `${fetchLogs.reason}`
                }
            )
            .setTimestamp()
        client.channels.cache.get(data.Channel).send({ embeds: [embed] });
    }

    if (oldMember.isCommunicationDisabled() && !newMember.isCommunicationDisabled()) {
        const embed = new MessageEmbed()
            .setAuthor({ name: newMember.user.tag, iconURL: newMember.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`${newMember}'s timeout has been lifted.`)
            .addFields(
                {
                    name: "Reason",
                    value: `Timeout expired!`
                }
            )
            .setTimestamp()
        client.channels.cache.get(data.Channel).send({ embeds: [embed] });
    }

    if(oldMember.user.username !== newMember.user.username) {
        const embed = new MessageEmbed()
            .setAuthor({ name: newMember.user.tag, iconURL: newMember.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`${newMember}'s username has been changed.`)
            .addFields(
                {
                    name: "Old Username",
                    value: `${oldMember.user.username}`
                },
                {
                    name: "New Username",
                    value: `${newMember.user.username}`
                }
            )
            .setTimestamp()
        client.channels.cache.get(data.Channel).send({ embeds: [embed] });
    }

    if(oldMember.nickname !== newMember.nickname && newMember.nickname !== null) {
        const embed = new MessageEmbed()
            .setAuthor({ name: newMember.user.tag, iconURL: newMember.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`${newMember}'s nickname has been changed.`)
            .addFields(
                {
                    name: "New Nickname",
                    value: `${newMember.nickname}`
                }
            )
            .setTimestamp()
        client.channels.cache.get(data.Channel).send({ embeds: [embed] });
    } 

    if(!newMember.nickname && oldMember.nickname) {
        const embed = new MessageEmbed()
            .setAuthor({ name: newMember.user.tag, iconURL: newMember.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`${newMember}'s nickname has been reset.`)
            .addFields(
                {
                    name: "Old Nickname",
                    value: `${oldMember.nickname}`
                }
            )
            .setTimestamp()
        client.channels.cache.get(data.Channel).send({ embeds: [embed] });
    }

    if(oldMember.user.avatarURL() !== newMember.user.avatarURL()) {
        const embed = new MessageEmbed()
            .setAuthor({ name: newMember.user.tag, iconURL: newMember.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`${newMember}'s avatar has been changed.`)
            .addFields(
                {
                    name: "Old Avatar",
                    value: `${oldMember.user.avatarURL()}`
                },
                {
                    name: "New Avatar",
                    value: `${newMember.user.avatarURL()}`
                }
            )
            .setTimestamp()
        client.channels.cache.get(data.Channel).send({ embeds: [embed] });
    }

    if(oldMember.roles.cache.size !== newMember.roles.cache.size) {
        const embed = new MessageEmbed()
            .setAuthor({ name: newMember.user.tag, iconURL: newMember.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`${newMember}'s roles have been updated.`)
            .addFields(
                {
                    name: "Old Roles",
                    value: `${oldMember.roles.cache.map(r => r.name).join(", ")}`
                },
                {
                    name: "New Roles",
                    value: `${newMember.roles.cache.map(r => r.name).join(", ")}`
                }
            )
            .setTimestamp()
        client.channels.cache.get(data.Channel).send({ embeds: [embed] });
    }
}