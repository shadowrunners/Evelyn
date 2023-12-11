// temporary import, will be added to @Schemas soon.
import { LevelsDB, LevelsData } from '@/Schemas/levels';
import { Client } from 'discordx';

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
		await LevelsDB.deleteOne({ userId, guildId }).lean().catch(() => {
			return new ReferenceError('This user does not exist in the database.');
		});
		return true;
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
			return await LevelsDB.findOne({ guildId }).sort([['totalXP', 'descending']]).limit(offset).lean();
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
	 * Adds XP to the user based on the provided amount of XP.
	 * @param userId The user's ID.
	 * @param guildId The guild's ID.
	 * @param xpAmount The amount of XP that will be added to the user.
	 * @returns A boolean indicating if the user levelled up or not.
	 */
	public async addXP(userId: string, guildId: string, xpAmount: number) {
		let hasLevelledUp: boolean;

		const member = await this.getUser(userId, guildId) as LevelsData;
		if (!member || member === null) {
			const newMember = this.createUser(userId, guildId);
			newMember.updateOne({
				$set: {
					xp: xpAmount,
					level: this.calculateLevel(xpAmount),
				},
			});

			newMember.save();
			return (this.calculateLevel(xpAmount) > 0);
		}

		const xp = member.totalXP += parseInt(xpAmount.toString(), 10);
		const level = this.calculateLevel(member.totalXP);

		if (level !== member.level) hasLevelledUp = true;
		else hasLevelledUp = false;

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

		if (!member || member === null) {
			const newMember = this.createUser(userId, guildId);
			newMember.updateOne({
				$set: {
					xp: XP,
					level: this.calculateLevel(XP),
				},
			});

			newMember.save();
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

	public async buildLeaderboard(client: Client, guildId: string, offset: number) {
		const users = await this.getDescendingUsers(guildId, offset);
		if (users.length < 1) return [];

		const computedArray = [];

		for (const key of users) {
			const user = await client.users.fetch(key.userId);
			computedArray.push({
				guildId: key.guildId,
				userId: key.userId,
				xp: key.totalXP,
				level: key.level,
				position: (users.findIndex(i => i.guildId === key.guildId && i.userId === key.userId) + 1),
				username: user.displayName,
			});
		}

		return computedArray;
	}
}