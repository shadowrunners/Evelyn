const { EmbedBuilder, CommandInteraction } = require("discord.js");
const DB = require("../../structures/schemas/ticketDB.js");

module.exports = {
  name: "ticket",
  description: "Options for tickets.",
  permissions: "ADMINISTRATOR",
  public: true,
  options: [
    {
      name: "action",
      type: 3,
      description: "Add or remove a member from this ticket.",
      required: true,
      choices: [
        { name: "Add", value: "add" },
        { name: "Remove", value: "remove" },
      ],
    },
    {
      name: "member",
      description: "Select a member.",
      type: 6,
      required: true,
    },
  ],
  /**
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const { guildId, options, channel } = interaction;

    const action = options.getString("action");
    const member = options.getMember("member");

    const Embed = new EmbedBuilder();

    switch (action) {
      case "add":
        DB.findOne(
          { GuildID: guildId, ChannelID: channel.id },
          async (err, docs) => {
            if (err) throw err;
            if (!docs)
              return interaction.reply({
                embeds: [
                  Embed.setColor("BLURPLE").setDescription(
                    "🔹 | This channel is not tied to a ticket."
                  ),
                ],
                ephermal: true,
              });

            if (docs.MembersID.includes(member.id))
              return interaction.reply({
                embeds: [
                  Embed.setColor("BLURPLE").setDescription(
                    "🔹 | This member is already added to this ticket."
                  ),
                ],
                ephermal: true,
              });
            docs.MembersID.push(member.id);

            channel.permissionOverwrites.edit(member.id, {
              SEND_MESSAGES: true,
              VIEW_CHANNEL: true,
              READ_MESSAGE_HISTORY: true,
            });

            interaction.reply({
              embeds: [
                Embed.setColor("BLURPLE").setDescription(
                  `🔹 | ${member} has been added to this ticket.`
                ),
              ],
            });
            docs.save();
          }
        );
        break;
      case "remove":
        DB.findOne(
          { GuildID: guildId, ChannelID: channel.id },
          async (err, docs) => {
            if (err) throw err;
            if (!docs)
              return interaction.reply({
                embeds: [
                  Embed.setColor("BLURPLE").setDescription(
                    "🔹 | This channel is not tied to a ticket."
                  ),
                ],
                ephermal: true,
              });

            if (!docs.MembersID.includes(member.id))
              return interaction.reply({
                embeds: [
                  Embed.setColor("BLURPLE").setDescription(
                    "🔹 | This member is not in this ticket."
                  ),
                ],
                ephermal: true,
              });
            docs.MembersID.remove(member.id);

            channel.permissionOverwrites.edit(member.id, {
              VIEW_CHANNEL: false,
            });

            interaction.reply({
              embeds: [
                Embed.setColor("BLURPLE").setDescription(
                  `🔹 | ${member} has been removed from this ticket.`
                ),
              ],
            });
            docs.save();
          }
        );
        break;
    }
  },
};