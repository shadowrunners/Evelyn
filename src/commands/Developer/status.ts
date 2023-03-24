import {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	EmbedBuilder,
	PermissionFlagsBits,
} from 'discord.js';
import { connection } from 'mongoose';
import { Util } from '../../Modules/Utils/utils.js';
import { cpus, platform } from 'os';
import { Command } from '../../Interfaces/interfaces.js';
import { Evelyn } from '../../Structures/Evelyn.js';

const { SendMessages } = PermissionFlagsBits;

const command: Command = {
	botPermissions: [SendMessages],
	developer: true,
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Shows the bot\'s status.'),
	async execute(interaction: ChatInputCommandInteraction, client: Evelyn) {
		const { application, ws, user, guilds, readyAt } = client;
		const { switchTo, convertToUnixTimestamp } = new Util();

		const uptime = Math.floor(readyAt.getTime() / 1000);
		const model = cpus()[0].model;
		const cores = cpus().length;
		const systemPlatform = platform()
			.replace('win32', 'Windows')
			.replace('linux', 'Linux');
		const createdTime = convertToUnixTimestamp(user.createdTimestamp);

		const embed = new EmbedBuilder().setColor('Blurple');
		await application.fetch();

		return interaction.reply({
			embeds: [
				embed
					.setTitle(`${user.username} | Status`)
					.addFields(
						{
							name: '**WebSocket Ping**',
							value: `${ws.ping}ms`,
							inline: true,
						},
						{
							name: '**Uptime**',
							value: `<t:${uptime}:R>`,
							inline: true,
						},
						{
							name: '**Database**',
							value: `${switchTo(connection.readyState)}`,
							inline: true,
						},
						{
							name: '**Connected to**',
							value: `${guilds.cache.size} servers`,
							inline: true,
						},
						{
							name: '**Active since**',
							value: `<t:${createdTime}:R>`,
							inline: true,
						},
						{
							name: '**Owner**',
							value: `${application.owner || 'None'}`,
							inline: true,
						},
						{
							name: '**OS**',
							value: systemPlatform,
							inline: true,
						},
						{
							name: '**CPU**',
							value: `${model} with ${cores} cores`,
							inline: true,
						},
					)
					.setThumbnail(user.avatarURL()),
			],
		});
	},
};

export default command;
