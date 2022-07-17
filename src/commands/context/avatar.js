const { MessageEmbed, ContextMenuInteraction } = require("discord.js");

module.exports = {
    name: "User Avatar",
    type: 2,
    context: true,
    public: true,
    /**
    * @param {ContextMenuInteraction} interaction 
    */
    async execute(interaction) {
        const target = await interaction.guild.members.fetch(interaction.targetId)
        await target.user.fetch();
        
        const avatarEmbed = new MessageEmbed()
            .setColor("BLURPLE")
            .setTitle(`${target.user.tag}'s Avatar`)
            .setImage(target.user.avatarURL({dynamic: true, size: 2048}))
            .setURL(target.avatarURL())
        interaction.reply({embeds: [avatarEmbed]});
    }
}