const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");

module.exports = {
  botPermissions: ["SendMessages"],
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Shows information about the current server."),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild } = interaction;
    const {
      createdTimestamp,
      ownerId,
      members,
      memberCount,
      channels,
      emojis,
      stickers,
    } = guild;
    const {
      GuildText,
      GuildVoice,
      GuildPublicThread,
      GuildNewsThread,
      GuildPrivateThread,
      GuildCategory,
      GuildStageVoice,
      GuildNews,
    } = ChannelType;

    const svinfo = new EmbedBuilder()
      .setColor("Grey")
      .setAuthor({ name: `${guild.name}`, iconURL: guild.iconURL() })
      .addFields(
        {
          name: "🔹| General",
          value: [
            `> Name: ${guild.name}`,
            `> Created: <t:${parseInt(createdTimestamp / 1000)}:R>`,
            `> Guild Owner: <@${ownerId}>`,
          ].join("\n"),
        },
        {
          name: "🔹| Users",
          value: [
            `> Members: ${members.cache.filter((m) => !m.user.bot).size}`,
            `> Bots: ${members.cache.filter((m) => m.user.bot).size}`,
            ``,
            `> Total: ${memberCount}`,
          ].join("\n"),
        },
        {
          name: "🔹| Channels",
          value: [
            `> Text: ${
              channels.cache.filter((c) => c.type === GuildText).size
            }`,
            `> Voice: ${
              channels.cache.filter((c) => c.type === GuildVoice).size
            }`,
            `> Threads: ${
              channels.cache.filter(
                (c) =>
                  c.type === GuildPublicThread &&
                  GuildPrivateThread &&
                  GuildNewsThread
              ).size
            }`,
            `> Categories: ${
              channels.cache.filter((c) => c.type === GuildCategory).size
            }`,
            `> Stages: ${
              channels.cache.filter((c) => c.type === GuildStageVoice).size
            }`,
            `> News: ${
              channels.cache.filter((c) => c.type === GuildNews).size
            }`,
            ``,
            `> Total: ${channels.cache.size}`,
          ].join("\n"),
        },
        {
          name: "🔹| Emojis and Stickers",
          value: [
            `> Animated: ${emojis.cache.filter((e) => e.animated).size}`,
            `> Static: ${emojis.cache.filter((e) => !e.animated).size}`,
            `> Stickers: ${stickers.cache.size}`,
            ``,
            `> Total: ${stickers.cache.size + emojis.cache.size}`,
          ].join("\n"),
        },
        {
          name: "🔹| Nitro Stats",
          value: [
            `> Boosts: ${guild.premiumSubscriptionCount}`,
            `> Boosters: ${members.cache.filter((m) => m.premiumSince).size}`,
          ].join("\n"),
        }
      )
      .setTimestamp();
    return interaction.reply({ embeds: [svinfo] });
  },
};
