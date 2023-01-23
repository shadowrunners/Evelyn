const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const RDB = require("../../../structures/schemas/roles.js");

module.exports = {
    subCommand: "roles.remove-role",
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options, guildId } = interaction;
        const embed = new EmbedBuilder().setColor("Blurple");
        const data = await RDB.findOne({ id: guildId });
        const role = options.getRole("role");

        await interaction.deferReply();

        const findRole = data.roles.roleArray.find((r) => r.roleId === role.id);
        if (!findRole) return interaction.editReply({ embeds: [embed.setDescription("🔹 | This role hasn't been added to the roles panel.")] });

        await GDB.findOneAndUpdate({
            id: guildId
        }, {
            $pull: {
                roleArray: {
                    roleId: role.id,
                }
            }
        });

        return interaction.editReply({ embeds: [embed.setDescription(`🔹 | ${role.name} has been removed from the roles panel.`)] })
    }
}