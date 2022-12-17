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
    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    const ticketsData = await ticketData.findOne({
      id: guild.id,
      ticketId: channel.id,
    });

    const gTicketData = await setupData.findOne({ id: guild.id });

    if (
      !member.roles.cache.find(
        (r) => r.id === gTicketData.tickets.ticketHandlers
      )
    )
      return interaction.reply({
        embeds: [
          embed.setDescription(
            "🔹 | Only the support team can use these buttons."
          ),
        ],
        ephemeral: true,
      });

    if (ticketsData.claimed === true)
      return interaction.reply({
        embeds: [
          embed.setDescription("🔹 | This ticket has already been claimed."),
        ],
        ephemeral: true,
      });

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
      embeds: [embed.setDescription(`🔹 | Ticket claimed.`)],
      ephemeral: true,
    });
  },
};
