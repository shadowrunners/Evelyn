const {
  ButtonInteraction,
  ChannelType,
  PermissionsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { GuildText } = ChannelType;
const { SendMessages, ViewChannel, ReadMessageHistory } =
  PermissionsBitField.Flags;
const setupData = require("../structures/schemas/guild.js");
const ticketData = require("../structures/schemas/ticket.js");

module.exports = {
  id: "createTicket",
  /**
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    const { guild, member } = interaction;

    const data = await setupData.findOne({ id: guild.id });
    if (!data) return;

    const ticketsData = await ticketData.findOne({
      creatorId: interaction.user.id,
    });

    if (ticketsData.creatorId && !ticketsData.closed) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setDescription("🔹 | You already have a ticket open.")
            .setTimestamp(),
        ],
        ephemeral: true,
      });
    }

    await guild.channels
      .create({
        name: `${interaction.user.username}-ticket`,
        type: GuildText,
        parent: data.tickets.category,
        permissionOverwrites: [
          {
            id: member.id,
            allow: [SendMessages, ViewChannel, ReadMessageHistory],
          },
          {
            id: interaction.guild.roles.everyone.id,
            deny: [SendMessages, ViewChannel, ReadMessageHistory],
          },
        ],
      })
      .then(async (channel) => {
        await ticketData.create({
          id: guild.id,
          ticketId: channel.id,
          claimed: false,
          closed: false,
          deleted: false,
          creatorId: interaction.user.id,
          claimer: null,
        });

        channel.setRateLimitPerUser(2);

        const Embed = new EmbedBuilder()
          .setAuthor({
            name: `${guild.name} | Your Ticket`,
            iconURL: guild.iconURL({ dynamic: true }),
          })
          .setDescription(
            `Hiya, <@${interaction.user.id}>! Please wait patiently while a staff member is coming to assist you with your issue. In the meantime, describe your issue as detailed as possible.`
          )
          .setTimestamp();

        const Buttons = new ActionRowBuilder();
        Buttons.addComponents(
          new ButtonBuilder()
            .setCustomId("closeTicket")
            .setLabel("Close")
            .setStyle(ButtonStyle.Success)
            .setEmoji("⛔"),
          new ButtonBuilder()
            .setCustomId("claimTicket")
            .setLabel("Claim")
            .setStyle(ButtonStyle.Success)
            .setEmoji("🛄")
        );
        channel.send({
          content: `<@&${data.tickets?.ticketHandlers}>`,
          embeds: [Embed],
          components: [Buttons],
        });
        await channel
          .send({
            content: `${member}, your ticket has been created: ${channel}`,
          })
          .then((m) => {
            setTimeout(() => {
              m.delete().catch(function () {
                /* Should always be empty. */
              });
            }, 5 * 1000);
          });
        await interaction.reply({
          content: `${member}, your ticket has been created: ${channel}`,
          ephemeral: true,
        });
      });
  },
};
