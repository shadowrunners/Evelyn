const { EmbedBuilder } = require("discord.js");
const PDB = require("../structures/schemas/playlist.js");
const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();
const { checkPlaylist, validate } = require("./AMHelper.js");
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

    console.log(pData);

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
  seek: async (interaction, player, time) => {
    const seekDuration = Number(time) * 1000;
    const duration = player.queue.current.length;

    if (seekDuration <= duration) {
      await player.shoukaku.seekTo(seekDuration);

      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`🔹 | Seeked to ${pms(seekDuration)}.`)
            .setTimestamp(),
        ],
      });
    }

    if (seekDuration > duration)
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`🔹 | Invalid seek time.`)
            .setTimestamp(),
        ],
      });
  },
  setVolume: async (interaction, player, volume) => {
    if (volume < 0 || volume > 100)
      return interaction.editReply({
        embeds: [
          embed.setDescription(
            "🔹| You can only set the volume from 0 to 100."
          ),
        ],
        ephemeral: true,
      });

    await player.setVolume(volume);

    return interaction.editReply({
      embeds: [
        embed
          .setDescription(
            `🔹 | Volume has been set to **${player.volume * 100}%**.`
          )
          .setFooter({
            text: `Action executed by ${interaction.user.username}.`,
            iconURL: interaction.user.avatarURL({ dynamic: true }),
          }),
      ],
    });
  },
};
