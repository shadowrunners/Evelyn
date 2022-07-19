const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const DB = require("../../structures/schemas/lockdownDB.js");
const ms = require("ms");

module.exports = {
	name: 'lock',
	description: '🔒 Locks a channel, preventing @everyone from sending messages.',
	permissions: 'MANAGE_CHANNELS',
	public: true,
	options: [
		{
			name: "time",
			description: "How long would you like the quarantine to last?",
			type: 3,
		},
		{
			name: "reason",
			description: "Provide a reason for the quarantine.",
			type: 3,
		},
	],
	/**
	 * @param {ChatInputCommandInteraction} interaction 
	 */
	async execute(interaction) {
		const { guild, channel, options } = interaction;
		const reason = options.getString("reason") || "Unknown";
		const Embed = new EmbedBuilder();

		if (!channel.permissionsFor(guild.id).has("SEND_MESSAGES"))
			return interaction.reply({
				embeds: [
					Embed.setDescription(
						"This channel is already locked."
					).setColor("Grey").setTimestamp(),
				],
			});

		channel.permissionOverwrites.edit(guild.id, {
			SEND_MESSAGES: false,
		});
		interaction.reply({
			embeds: [
				Embed.setDescription(
					`This channel is now locked for: ${reason}`
				).setColor("Grey").setTimestamp(),
			],
		});

		const time = options.getString("time");
		if (time) {
			const expiredate = Date.now() + ms(time);
			DB.create({ GuildID: guild.id, ChannelID: channel.id, Time: expiredate });

			setTimeout(async () => {
				channel.permissionOverwrites.edit(guild.id, {
					SEND_MESSAGES: null,
				});
				interaction.editReply({
					embeds: [
						Embed.setDescription("The lockdown has been lifted."
						).setColor("Grey"),
					],
				})
					.catch(() => { });
				await DB.deleteOne({ ChannelID: channel.id });
			}, ms(time));
		}
	},
};
