const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const RDB = require("../../../structures/schemas/roles.js");

module.exports = {
    subCommand: "roles.add-role",
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options, guildId, guild } = interaction;
        const embed = new EmbedBuilder().setColor("Blurple");

        const panel = options.getString("panel");
        const role = options.getRole("role");
        const description = options.getString("description");
        const emoji = options.getString("emoji");

        const rData = await RDB.findOne({ id: guildId, panelName: panel });

        await interaction.deferReply();

        if (role.position >= guild.members.me.roles.highest.position)
            return interaction.editReply({ embeds: [embed.setDescription("🔹 | I can't assign a role that's higher or equal than mine.")] })

        await RDB.findOneAndUpdate({
            id: guildId,
            panelName: panel,
        }, {
            $push: {
                roleArray: {
                    roleId: role.id,
                    description,
                    emoji
                }
            }
        });

        return interaction.editReply({ embeds: [embed.setDescription(`🔹 | ${role.name} has been added to the roles panel. If you have already sent out the panel, you will need to re-send it in order for it to update.`)] })
    }
}