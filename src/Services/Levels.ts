// temporary import, will be added to @Schemas soon.
import { LevelsDB, LevelsData } from '@/Schemas/levels';
// import { RoleRewardsDB } from '@/Schemas/roleRewards';
import { GuildDB } from '@/Schemas/guild';
import { Client } from 'discordx';
import { singleton } from 'tsyringe';

type Leaderboard = {
	/** The user's guild ID. */
	guildId: string;
	/** The user's ID. */
	userId: string;
	/** The user's XP. */
	xp: number;
	/** The user's level. */
	level: number;
	/** The user's current position on the leaderboard. */
	position: number;
}[];

@singleton()
export class Levels {
	/**
	 * Creates a new user in the Levels database.
	 * @param userId The user's ID.
	 * @param guildId The guild's ID.
	 * @returns An object containing the new user's data.
	 */
	private createUser(userId: string, guildId: string) {
		try {
			return new LevelsDB({ userId, guildId, totalXP: 0, level: 0 });
		}
		catch (_err) {
			new ReferenceError('There was an error while saving the creating the level profile in the database.');
			return;
		}
	}

	/**
	 * Deletes the user from the Levels database.
	 * @param userId The user's ID.
	 * @param guildId The guild's ID.
	 * @returns A boolean indicating if everything went smoothly.
	 */
	public async deleteUser(userId: string, guildId: string) {
		try {
			await LevelsDB.deleteOne({ userId, guildId }).lean();
			return true;
		}
		catch (_err) {
			new ReferenceError('This user does not exist in the database.');
			return false;
		}
	}

	/**
	 * Fetches the data regarding the provided user from the database.
	 * @param userId The user's ID.
	 * @param guildId The guild's ID.
	 * @returns The provided user's data.
	 */
	public async getUser(userId: string, guildId: string): Promise<LevelsData> {
		try {
			return await LevelsDB.findOne({ userId, guildId }).lean();
		}
		catch (_err) {
			new ReferenceError('This user does not exist in the database.');
			return;
		}
	}

	/**
	 * Fetches the provided amount of users (offset) based on the amount of XP.
	 * @param guildId The guild's ID.
	 * @param offset The number of users that will be returned.
	 * @returns The data of the returned users.
	 */
	private async getDescendingUsers(guildId: string, offset: number): Promise<LevelsData[]> {
		try {
			return await LevelsDB.find({ guildId }).sort([['totalXP', 'descending']]).limit(offset).lean();
		}
		catch (_err) {
			new ReferenceError('This guild does not exist in the database or there is no data regarding it.');
		}
	}

	/**
	 * Updates the provided user's data in the database.
	 * @param userId The user's ID.
	 * @param guildId The guild's ID.
	 * @param changes The changes you'd like to do.
	 * @returns A boolean indicating if the process went smoothly.
	 */
	private async updateUser(userId: string, guildId: string, changes: unknown) {
		await LevelsDB.findOne({ userId, guildId }).updateOne(changes).lean().catch(() => {
			return new ReferenceError('This user does not exist in the database.');
		});
		return true;
	}

	/**
	 * Calculates the user's current level based upon the amount of XP they have.
	 * @param xpAmount The amount of XP the user has.
	 * @returns The user's rank.
	 */
	private calculateLevel(xpAmount: number) {
		return Math.floor(0.1 * Math.sqrt(xpAmount));
	}

	/**
	 * Calculates the XP required to reach the next level.
	 * @param targetLevel The amount of XP required to reach the next level.
	 * @returns The amount of XP required to reach the next level.
	 */
	public calculateNextLevel(targetLevel: number) {
		return targetLevel * targetLevel * 100;
	}

	/**
	 * Adds XP to the user based on the provided amount of XP.
	 * @param userId The user's ID.
	 * @param guildId The guild's ID.
	 * @param xpAmount The amount of XP that will be added to the user.
	 * @returns A boolean indicating if the user levelled up or not.
	 */
	public async addXP(userId: string, guildId: string, xpAmount: number) {
		const member = await this.getUser(userId, guildId);
		if (!member) {
			const newMember = this.createUser(userId, guildId);
			const level = this.calculateLevel(xpAmount);
			newMember.updateOne({
				$set: { totalXP: xpAmount, level },
			});

			await newMember.save();
			return (this.calculateLevel(xpAmount) > 0);
		}

		const xp = member.totalXP += parseInt(xpAmount.toString(), 10);
		const level = this.calculateLevel(member.totalXP);
		const hasLevelledUp = Boolean(level !== member.level);

		await this.updateUser(userId, guildId, {
			$set: {
				totalXP: xp,
				level,
			},
		});

		return hasLevelledUp;
	}

	/**
	 * Removes XP from the user based on the provided amount of XP.
	 * @param userId The user's ID.
	 * @param guildId The guild's ID.
	 * @param xpAmount The amount of XP that will be removed from the user.
	 * @returns A boolean indicating if the process went smoothly.
	 */
	public async removeXP(userId: string, guildId: string, xpAmount: number) {
		if (xpAmount <= 0 || isNaN(xpAmount)) return new RangeError('The XP amount needs to be more than 0 and a valid number.');
		const member = await this.getUser(userId, guildId) as LevelsData;

		let XP: number;
		if (member?.totalXP < xpAmount) XP = 0;
		else XP = member?.totalXP - xpAmount;

		if (!member) {
			const newMember = this.createUser(userId, guildId);
			newMember.updateOne({
				$set: {
					xp: XP,
					level: this.calculateLevel(XP),
				},
			});

			await newMember.save();
			return (this.calculateLevel(XP) > 0);
		}

		const xp = member.totalXP += parseInt(xpAmount.toString(), 10);
		const level = this.calculateLevel(member.totalXP);

		return await this.updateUser(userId, guildId, {
			$set: {
				totalXP: xp,
				level,
			},
		});
	}

	/**
	 * Builds the level leaderboard.
	 * @param client The Evelyn client.
	 * @param guildId The ID of the guild that the leaderboard will be built for.
	 * @param offset The number of users that will be returned.
	 * @returns {Leaderboard} An array with the leaderboard type that contains all the necessary data.
	 */
	public async buildLeaderboard(client: Client, guildId: string, offset: number): Promise<Leaderboard> {
		const users = await this.getDescendingUsers(guildId, offset);
		if (users.length < 1) return [];

		const computedArray: Leaderboard = [];

		for (const key of users) {
			computedArray.push({
				guildId: key.guildId,
				userId: key.userId,
				xp: key.totalXP,
				level: key.level,
				position: (users.findIndex(i => i.guildId === key.guildId && i.userId === key.userId) + 1),
			});
		}

		return computedArray;
	}

	/**
	 * Checks to see if the channel is restricted from getting any XP.
	 * @param guildId The ID of the guild.
	 * @param channelId The ID of the channel the check will be performed for.
	 * @returns {Boolean} A boolean indicating if the channel is restricted or not.
	 */
	public async isChannelRestricted(guildId: string, channelId: string): Promise<boolean> {
		const { levels: { restrictedChannels } } = await GuildDB.findOne({ guildId }).select('levels').lean();
		const filteredChannels = restrictedChannels.filter((channel) => channel === channelId);

		if (filteredChannels.length <= 0) return false;
		else return true;
	}

	/**
	 * Checks to see if the role is restricted from getting any XP.
	 * @param guildId The ID of the guild.
	 * @param roleId The ID of the role the check will be performed for.
	 * @returns {Boolean} A boolean indicating if the role is restricted or not.
	 */
	public async isRoleRestricted(guildId: string, roleId: string): Promise<boolean> {
		const { levels: { restrictedRoles } } = await GuildDB.findOne({ guildId }).select('levels').lean();
		console.log(restrictedRoles);
		const filteredRoles = restrictedRoles.filter((role) => role === roleId);
		console.log(filteredRoles);

		if (filteredRoles.length <= 0) return false;
		else return true;
	}

	// Code for an eventual role rewards system.
	// It technically kinda works but it'll stay like this till the dashboard implementation is worked on.
	/**
	 * public async addRoleReward(guildId: string, role: Role, level: number) {
		const data = await RoleRewardsDB.findOne({ guildId });

		if (!data) {
			const createdData = await RoleRewardsDB.create({ guildId, rewards: [] });
			createdData.rewards.push({ roleId: role.id, level });
			return await createdData.save();
		}

		data.rewards.push({ roleId: role.id, level });
		return await data.save();
	}

	public async removeRoleReward(guildId: string, role: Role, level: number) {
		const data = await RoleRewardsDB.findOne({ guildId, roleId: role.id });

		if (!data) return console.log('No guild found.');

		const index = data.rewards.indexOf({ roleId: role.id, level });
		if (index < -1) return;

		data.rewards.splice(index, 1);
		return await data.save();
	}
	 */
}