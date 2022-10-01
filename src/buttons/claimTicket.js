const { ButtonInteraction, EmbedBuilder } = require("discord.js");
const setupData = require("../structures/schemas/guild.js");
const ticketData = require("../structures/schemas/ticket.js");

module.exports = {
  id: "claimTicket",
  /**
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    const { guild, member, channel } = interaction;

    const Embed = new EmbedBuilder();

    const ticketsData = await ticketData.findOne({
      id: guild.id,
      ticketId: channel.id,
    });

    const gTicketData = await setupData.findOne({ id: guild.id });

    if (
      !member.roles.cache.find(
        (r) => r.id === gTicketData.tickets.ticketHandlers
      )
    ) {
      return interaction.reply({
        embeds: [
          Embed.setColor("Blurple")
            .setDescription("🔹 | Only the support team can use these buttons.")
            .setTimestamp(),
        ],
        ephemeral: true,
      });
    }

    if (ticketsData.claimed === true) {
      return interaction.reply({
        embeds: [
          Embed.setColor("Blurple")
            .setDescription("🔹 | This ticket has already been claimed.")
            .setTimestamp(),
        ],
        ephemeral: true,
      });
    }

    await ticketData.updateMany(
      {
        ticketId: channel.id,
      },
      {
        claimed: true,
        claimer: member.id,
      }
    );

    return interaction.reply({
      embeds: [Embed.setDescription(`🔹 | Ticket claimed.`).setTimestamp()],
      ephemeral: true,
    });
  },
};
