import {
	// eslint-disable-next-line no-unused-vars
	Client,
	SlashCommandBuilder,
	// eslint-disable-next-line no-unused-vars
	ChatInputCommandInteraction,
	EmbedBuilder,
} from 'discord.js';
import { connection } from 'mongoose';
//import Util = require('../../modules/Utils/utils.js');
import { cpus, platform } from 'os';
import { Evelyn } from '../../structures/Evelyn';
import { Command } from '../../interfaces/interfaces';

export const command: Command = {
	//botPermissions: [SendMessages],
	developer: true,
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription("Shows the bot's status."),
	async execute(interaction: ChatInputCommandInteraction, client: Evelyn) {
		const { application, ws, user, guilds, readyAt } = client;
		//const util = new Util(interaction);

		//const uptime = Math.floor(readyAt / 1000);
		const model = cpus()[0].model;
		const cores = cpus().length;
		const systemPlatform = platform()
			.replace('win32', 'Windows')
			.replace('linux', 'Linux');

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
						//{
						//	name: '**Uptime**',
						//	value: `<t:${uptime}:R>`,
						//	inline: true,
						//},
						//{
						//	name: '**Database**',
						//	value: `${util.switchTo(connection.readyState)}`,
						//	inline: true,
						//},
						{
							name: '**Connected to**',
							value: `${guilds.cache.size} servers`,
							inline: true,
						},
						//{
						//	name: '**Active since**',
						//	value: `<t:${parseInt(user.createdTimestamp / 1000)}:R>`,
						//	inline: true,
						//},
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
						}
					)
					.setThumbnail(user.avatarURL()),
			],
		});
	},
};
