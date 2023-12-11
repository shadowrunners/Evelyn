import { bakeUnixTimestamp } from '@Helpers/messageHelpers.js';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Discord, Slash, Guild } from 'discordx';
import { config } from '@Config';
import { Evelyn } from '@Evelyn';
import { cpus, platform } from 'os';
import mongoose from 'mongoose';

@Discord()
@Guild(config.debug.devGuild)
export class Status {
	private embed: EmbedBuilder;

	@Slash({
		description: 'Shows the bot\'s status.',
		name: 'status',
	})
	async status(interaction: ChatInputCommandInteraction, client: Evelyn) {
		const { application, ws, user, guilds, readyAt } = client;

		const uptime = Math.floor(readyAt.getTime() / 1000);
		const model = cpus()[0].model;
		const cores = cpus().length;
		const systemPlatform = platform()
			.replace('win32', 'Windows')
			.replace('linux', 'Linux');
		const createdTime = bakeUnixTimestamp(user.createdTimestamp);
		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		await application.fetch();

		return interaction.reply({
			embeds: [
				this.embed
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
							value: `${this.switchTo(mongoose.connection.readyState)}`,
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
							value: `${application.owner ?? 'None'}`,
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
	}

	/** Determines the value of the current database connection status. */
	switchTo(val: number) {
		switch (val) {
		case 0:
			return '🟥 Disconnected';
		case 1:
			return '🔷 Connected';
		case 2:
			return '🟨 Connecting';
		case 3:
			return '🟨 Disconnecting';
		default:
			break;
		}
	}
}