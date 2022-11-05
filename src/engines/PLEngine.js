const { EmbedBuilder } = require("discord.js");
const PDB = require("../structures/schemas/playlist.js");
const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();
const { checkPlaylist, validate, validateTrack } = require("./AMHelper.js");
const Util = require("../utils/utils.js");
const pms = require("pretty-ms");

module.exports = {
  createPlaylist: async (interaction, pName) => {
    const pData = await PDB.findOne({
      userID: interaction.user.id,
      playlistName: pName,
    });

    const userData = PDB.findOne({
      userID: interaction.user.id,
    });

    if (checkPlaylist(pName, pData, userData)) return;

    const newPlaylist = new PDB({
      name: interaction.user.username,
      userID: interaction.user.id,
      playlistName: pName,
      created: Math.round(Date.now() / 1000),
    });

    await newPlaylist.save();

    return interaction.editReply({
      embeds: [
        embed.setDescription(
          `🔹 | Your playlist **${pName}** has been created.`
        ),
      ],
    });
  },
  deletePlaylist: async (interaction, pName) => {
    const pData = await PDB.findOne({
      userID: interaction.user.id,
      playlistName: pName,
    });

    if (validate(interaction, pData)) return;

    await pData.delete();

    return interaction.editReply({
      embeds: [
        embed.setDescription(
          `🔹 | Your playlist **${pName}** has been deleted.`
        ),
      ],
    });
  },
  addCurrent: async (interaction, player, pName) => {
    const track = player?.queue.current;

    const pData = await PDB.findOne({
      playlistName: pName,
      userID: interaction.user.id,
    });

    if (validate(interaction, pData, track)) return;

    pData.playlistData.push({
      title: track.title,
      uri: track.uri,
      author: track.author,
      duration: track.length,
    });

    await PDB.updateOne(
      {
        userID: interaction.user.id,
        playlistName: pName,
      },
      {
        $push: {
          playlistData: {
            title: track.title,
            uri: track.uri,
            author: track.author,
            duration: track.length,
          },
        },
      }
    );

    return interaction.editReply({
      embeds: [
        embed.setDescription(
          `🔹 | **[${track.title}](${track.uri})** has been added to your playlist.`
        ),
      ],
    });
  },
  showPlaylistTracks: async (client, interaction, pName) => {
    const pData = await PDB.findOne({
      playlistName: pName,
      userID: interaction.user.id,
    });

    if (validate(interaction, pData)) return;

    const trackData = pData.playlistData;
    const list = pData.playlistData.length;
    const tracks = [];
    const embeds = [];

    for (let i = 0; i < list; i++) {
      tracks.push(
        `${i + 1} • **[${trackData[i].title}](${trackData[i].uri})** • [${pms(
          trackData[i].duration
        )}]`
      );
    }

    for (let i = 0; i < tracks.length; i += 10) {
      embed
        .setTitle(`${pData.playlistName} by ${pData.name}`)
        .setDescription(tracks.slice(i, i + 10).join("\n"));
      embeds.push(embed);
    }

    return await Util.embedPages(client, interaction, embeds);
  },
  showAllPlaylists: async (client, interaction) => {
    const pData = await PDB.find({
      userID: interaction.user.id,
    });

    if (validate(interaction, pData)) return;

    const playlists = [];
    const embeds = [];

    for (let i = 0; i < pData.length; i++) {
      playlists.push(
        `**${pData[i].playlistName}** • ${pData[i].playlistData?.length} song(s)`
      );
    }

    for (let i = 0; i < playlists.length; i += 10) {
      embed
        .setTitle(`Playlists curated by ${pData[i].name}`)
        .setDescription(playlists.slice(i, i + 10).join("\n"));
      embeds.push(embed);
    }

    return await Util.embedPages(client, interaction, embeds);
  },
  removeTrack: async (interaction, pName, song) => {
    const pData = await PDB.findOne({
      playlistName: pName,
      userID: interaction.user.id,
    });
    const tracks = pData?.playlistData;
    if (await validateTrack(interaction, song, tracks)) return;

    await PDB.updateOne(
      {
        userID: interaction.user.id,
        playlistName: pName,
      },
      {
        $pull: {
          playlistData: pData.playlistData[song],
        },
      }
    );

    return interaction.editReply({
      embeds: [
        embed.setDescription(
          `🔹 | **${tracks[song].title}** has been removed from your playlist.`
        ),
      ],
    });
  },
};
