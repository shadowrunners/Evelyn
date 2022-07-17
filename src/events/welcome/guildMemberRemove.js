const { Client, GuildMember, EmbedBuilder } = require("discord.js");
const DB = require("../../structures/schemas/guildDB.js");

module.exports = {
    name: "guildMemberRemove",
    /**
     * @param {GuildMember} member
     * @param {Client} client
    */
    async execute(member, client) {
        const data = await DB.findOne({
            Guild: member.guild.id,
        })

        if (!data) return;
        if (data.goodbye.enabled == "false" || data.goodbye.channel == null) return;

        const goodbyeData = data.goodbye.json.embed;

        const goodbyeEmbed = new EmbedBuilder()
        const color = goodbyeData.color;
        if (color) goodbyeEmbed.setColor(color);

        const title = goodbyeData.title;
        if (title !== null) goodbyeEmbed.setTitle(title);

        const titleUrl = goodbyeData.titleURL;
        if (titleUrl !== null) goodbyeEmbed.setURL(titleUrl);

        const textEmbed = goodbyeData.description.replace(/{user}/g, `${member}`)
            .replace(/{user_tag}/g, `${member.user.tag}`)
            .replace(/{user_name}/g, `${member.user.username}`)
            .replace(/{user_ID}/g, `${member.id}`)
            .replace(/{guild_name}/g, `${member.guild.name}`)
            .replace(/{guild_ID}/g, `${member.guild.id}`)
            .replace(/{memberCount}/g, `${member.guild.memberCount}`)
            .replace(/{size}/g, `${member.guild.memberCount}`)
            .replace(/{guild}/g, `${member.guild.name}`)
            .replace(/{member_createdAt}/g, `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`)
        if (textEmbed !== null) goodbyeEmbed.setDescription(textEmbed);

        const authorName = goodbyeData.author.name.replace(/{user_tag}/g, `${member.user.tag}`)
            .replace(/{user_name}/g, `${member.user.username}`)
            .replace(/{user_ID}/g, `${member.id}`)
            .replace(/{guild_name}/g, `${member.guild.name}`)
            .replace(/{guild_ID}/g, `${member.guild.id}`)
            .replace(/{memberCount}/g, `${member.guild.memberCount}`)
            .replace(/{size}/g, `${member.guild.memberCount}`)
            .replace(/{guild}/g, `${member.guild.name}`)
        if (authorName !== null) goodbyeEmbed.setAuthor(authorName);

        const authorImgURL = goodbyeData.author.icon_url;
            if (authorImgURL !== null) goodbyeEmbed.setAuthor({ name: authorName, iconURL: authorImgURL });

        const footer = goodbyeData.footer;
            if (footer !== null) goodbyeEmbed.setFooter(footer);

        const footerIcon = goodbyeData.footer.icon_url;
            if (footer && footerIcon !== null) goodbyeEmbed.setFooter({ name: footer, iconURL: footerIcon });

        const image = goodbyeData.image.url;
            if (image !== null) goodbyeEmbed.setImage(image)

        client.channels.cache.get(data.goodbye.channel).send({ embeds: [goodbyeEmbed] });
    }
}




        