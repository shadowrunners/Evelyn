const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

async function embedPages(client, interaction, embeds) {
  const pages = {};
  const getRow = (id) => {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("◀")
        .setCustomId("prev_embed")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(pages[id] === 0),

      new ButtonBuilder()
        .setLabel("▶")
        .setCustomId("next_embed")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(pages[id] === embeds.length - 1)
    );
    return row;
  };

  const id = interaction.user.id;
  pages[id] = pages[id] || 0;
  let Pagemax = embeds.length;

  const embed = embeds[pages[id]];

  await embeds[pages[id]].setFooter({
    text: `Page ${pages[id] + 1} from ${Pagemax}`,
  });

  const replyEmbed = await interaction.editReply({
    embeds: [embed],
    components: [getRow(id)],
    fetchReply: true,
  });

  const filter = (i) => i.user.id === interaction.user.id;
  const time = 1000 * 60 * 5;

  const collector = await replyEmbed.createMessageComponentCollector({
    filter,
    time,
  });

  collector.on("collect", async (b) => {
    if (!b) return;
    if (b.customId !== "prev_embed" && b.customId !== "next_embed") return;

    b.deferUpdate();

    if (b.customId === "prev_embed" && pages[id] > 0) {
      --pages[id];
    } else if (b.customId === "next_embed" && pages[id] < embeds.length - 1) {
      ++pages[id];
    }

    await embeds[pages[id]].setFooter({
      text: `Page ${pages[id] + 1} of ${Pagemax}`,
    });

    await interaction.editReply({
      embeds: [embeds[pages[id]]],
      components: [getRow(id)],
      fetchReply: true,
    });
  });
}

function unique(arr1, arr2) {
  const unique1 = arr1.filter((z) => arr2.indexOf(z) === -1);
  const unique2 = arr2.filter((z) => arr1.indexOf(z) === -1);

  const unique = unique1.concat(unique2);
  return unique;
}

function switchTo(val) {
  let status = " ";
  switch (val) {
    case 0:
      status = "🟥 Disconnected";
      break;
    case 1:
      status = `🔷 Connected`;
      break;
    case 2:
      status = `🟨 Connecting`;
      break;
    case 3:
      status = `🟨 Disconnecting`;
      break;
    default:
      break;
  }
  return status;
}

function check4Perms(interaction, command) {
  if (
    !interaction.guild.members.me.permissions.has(
      PermissionsBitField.resolve(command.botPermissions)
    )
  ) {
    const permission = PermissionsBitField.resolve(command.botPermissions);

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blurple")
          .setTitle("Missing Permissions")
          .setDescription(
            `🔹 | I'm missing several permissions, might wanna have a look at that.`
          )
          .addFields({
            name: "Permissions Missing",
            value: `${permission}`,
          }),
      ],
      ephemeral: true,
    });
  }
}

module.exports = {
  check4Perms,
  embedPages,
  unique,
  switchTo,
};
