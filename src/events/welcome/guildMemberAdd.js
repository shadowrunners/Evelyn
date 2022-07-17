const { Client, GuildMember, EmbedBuilder } = require("discord.js");
const DB = require("../../structures/schemas/guildDB.js");

module.exports = {
    name: "guildMemberAdd",
    /**
     * @param {GuildMember} member
     * @param {Client} client
     */
    async execute(member, client) {
        const data = await DB.findOne({
            id: member.guild.id,
        })

        if (!data) return;
        if (data.welcome.enabled == "false" || data.welcome.channel == null) return;

        const welcomeData = data.welcome.json.embed;

        const welcomeEmbed = new EmbedBuilder()
        const color = welcomeData.color;
        if (color) welcomeEmbed.setColor(color);

        const title = welcomeData.title;
        if (title !== null) welcomeEmbed.setTitle(title);

        const titleUrl = welcomeData.titleURL;
        if (titleUrl !== null) welcomeEmbed.setURL(titleUrl);

        const textEmbed = welcomeData.description.replace(/{user}/g, `${member}`)
            .replace(/{user_tag}/g, `${member.user.tag}`)
            .replace(/{user_name}/g, `${member.user.username}`)
            .replace(/{user_ID}/g, `${member.id}`)
            .replace(/{guild_name}/g, `${member.guild.name}`)
            .replace(/{guild_ID}/g, `${member.guild.id}`)
            .replace(/{memberCount}/g, `${member.guild.memberCount}`)
            .replace(/{size}/g, `${member.guild.memberCount}`)
            .replace(/{guild}/g, `${member.guild.name}`)
            .replace(/{member_createdAt}/g, `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`)
        if (textEmbed !== null) welcomeEmbed.setDescription(textEmbed);

        const authorName = welcomeData.author.name.replace(/{user_tag}/g, `${member.user.tag}`)
            .replace(/{user_name}/g, `${member.user.username}`)
            .replace(/{user_ID}/g, `${member.id}`)
            .replace(/{guild_name}/g, `${member.guild.name}`)
            .replace(/{guild_ID}/g, `${member.guild.id}`)
            .replace(/{memberCount}/g, `${member.guild.memberCount}`)
            .replace(/{size}/g, `${member.guild.memberCount}`)
            .replace(/{guild}/g, `${member.guild.name}`)
        if (authorName !== null) welcomeEmbed.setAuthor(authorName);

        const authorImgURL = welcomeData.author.icon_url;
            if (authorImgURL !== null) welcomeEmbed.setAuthor({ name: authorName, iconURL: authorImgURL });

        const footer = welcomeData.footer;
            if (footer !== null) welcomeEmbed.setFooter(footer);

        const footerIcon = welcomeData.footer.icon_url;
            if (footer && footerIcon !== null) welcomeEmbed.setFooter({ name: footer, iconURL: footerIcon });

        const image = welcomeData.image.url;
            if (image !== null) welcomeEmbed.setImage(image)

        client.channels.cache.get(data.welcome.channel).send({ embeds: [welcomeEmbed] });
    }
}