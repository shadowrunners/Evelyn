const { EmbedBuilder } = require("discord.js");
const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

function checkAvatar(user1, user2, interaction) {
  const avatar = user1?.avatarURL() || user2?.avatarURL();

  if (!avatar)
    return interaction.editReply({
      embeds: [embed.setDescription("🔹 | You forgot to mention a user.")],
      ephemeral: true,
    });
}

function checkUsername(user1, user2, interaction) {
  const username = user1?.username || user2?.username;

  if (!username)
    return interaction.editReply({
      embeds: [embed.setDescription("🔹 | You forgot to mention a user.")],
      ephemeral: true,
    });
}

function checkText(text, interaction) {
  if (!text)
    return interaction.editReply({
      embeds: [embed.setDescription("🔹 | You forgot to provide some text.")],
      ephemeral: true,
    });
}

function checkTarget(target, interaction) {
  if (!target)
    return interaction.editReply({
      embeds: [embed.setDescription("🔹 | You forgot to provide a user.")],
      ephemeral: true,
    });
}

module.exports = { checkAvatar, checkUsername, checkText, checkTarget };
