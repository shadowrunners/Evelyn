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

        await interaction.deferReply({ ephemeral: true });

        if (role.position >= guild.members.me.roles.highest.position)
            return interaction.editReply({ embeds: [embed.setDescription("🔹 | I can't assign a role that's higher or equal than mine.")] });
        if (rData.roleArray.some(r => r.roleId === role.id))
            return interaction.editReply({ embeds: [embed.setDescription("🔹 | This role has already been added to the panel.")] });
        if (rData.roleArray.length >= 10)
            return interaction.editReply({ embeds: [embed.setDescription("🔹 | A panel can only have 10 roles.")] });

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

        return interaction.editReply({
            embeds: [
                embed.setDescription(`🔹 | ${role.name} has been added to the roles panel. If you have already sent out the panel, you will need to re-send it in order for it to update.`)],
        });
    }
}