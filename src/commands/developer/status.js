const {
  Client,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const { connection } = require("mongoose");
const Util = require("../../functions/utils.js");
const os = require("os");

module.exports = {
  botPermissions: ["SendMessages"],
  developer: true,
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("Shows the bot's status."),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const util = new Util(interaction);
    await interaction.deferReply();

    const uptime = Math.floor(client.readyAt / 1000);
    const model = os.cpus()[0].model;
    const cores = os.cpus().length;
    const platform = os
      .platform()
      .replace("win32", "Windows")
      .replace("linux", "Linux");

    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    await client.application.fetch();

    return interaction.editReply({
      embeds: [
        embed
          .setTitle(`${client.user.username} | Status`)
          .addFields(
            {
              name: "**WebSocket Ping**",
              value: `${client.ws.ping}ms`,
              inline: true,
            },
            {
              name: "**Uptime**",
              value: `<t:${uptime}:R>`,
              inline: true,
            },
            {
              name: "**Database**",
              value: `${util.switchTo(connection.readyState)}`,
              inline: true,
            },
            {
              name: "**Connected to**",
              value: `${client.guilds.cache.size} servers`,
              inline: true,
            },
            {
              name: "**Active since**",
              value: `<t:${parseInt(client.user.createdTimestamp / 1000)}:R>`,
              inline: true,
            },
            {
              name: "**Owner**",
              value: `${client.application.owner || "None"}`,
              inline: true,
            },
            {
              name: "**OS**",
              value: platform,
              inline: true,
            },
            {
              name: "**CPU**",
              value: `${model} with ${cores} cores`,
              inline: true,
            }
          )
          .setThumbnail(
            client.user.avatarURL({ format: "png", dynamic: true, size: 1024 })
          ),
      ],
    });
  },
};
