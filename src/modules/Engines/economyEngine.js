const { EmbedBuilder } = require('discord.js');

module.exports = class EcoEngine {
	/** Creates a new instance of the Economy Engine class. */
	constructor(interaction, client) {
		/** The client object. */
		this.client = client;
		/** The interaction object. */
		this.interaction = interaction;
		/** The base embed used for keeping away from repeated code. */
		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
	}

	/** Fetches the user. */
	async fetchUser() {
		const user = await this.client.economy.cache.users.get({
			memberID: this.interaction.user.id,
			guildID: this.interaction.guildId,
		});

		return user;
	}

	/** Fetches the provided user. */
	async fetchProvidedTarget(user) {
		const providedTarget = await this.client.economy.cache.users.get({
			memberID: user.id,
			guildID: this.interaction.guildId,
		});

		return providedTarget;
	}

	/** Fetches the user cache from the Discord.js Client. */
	async getUser(userID) {
		const getUser = await this.client.users.cache.get(userID);
		return getUser;
	}

	/** Fetches the guild cache. */
	async getGuild() {
		const fetchGuild = await this.client.economy.cache.guilds.get({
			guildID: this.interaction.guildId,
		});

		return fetchGuild;
	}

	/** Fetches your purchase history. */
	async getHistory() {
		const ecoHistory =
			(await this.client.economy.cache.history.get({
				memberID: this.interaction.user.id,
				guildID: this.interaction.guildId,
			})) || [];

		return ecoHistory;
	}

	/** Fetches the server's shop. */
	async getShop() {
		const ecoHistory =
			(await this.client.economy.cache.shop.get({
				guildID: this.interaction.guildId,
			})) || [];

		return ecoHistory;
	}

	/** Fetches your inventory. */
	async getInventory() {
		const ecoHistory =
			(await this.client.economy.cache.inventory.get({
				memberID: this.interaction.user.id,
				guildID: this.interaction.guildId,
			})) || [];

		return ecoHistory;
	}

	/** Collects the daily reward. */
	async collectDaily() {
		const ecoUser = await this.fetchUser();
		const dailyResult = await ecoUser.rewards.getDaily();

		if (dailyResult.cooldown) {
			const cooldownTime = dailyResult.cooldown.time;
			let cooldownTimeString = '';

			if (cooldownTime.days) {
				cooldownTimeString += `**${cooldownTime.days}** days,`;
			}
			if (cooldownTime.days || cooldownTime.hours) {
				cooldownTimeString += `**${cooldownTime.hours}** hours, `;
			}

			if (cooldownTime.hours || cooldownTime.minutes) {
				cooldownTimeString += `**${cooldownTime.minutes}** minutes, `;
			}

			cooldownTimeString += `**${cooldownTime.seconds}** seconds`;

			return this.interaction.editReply({
				embeds: [
					this.embedsetDescription(
						`🔹 | ${ecoUser}, you can claim your daily reward in ${cooldownTimeString}!`,
					),
				],
			});
		}

		return this.interaction.editReply({
			embeds: [
				this.embed.setDescription(
					`🔹 | ${dailyResult.reward} RC have been added to your account!`,
				),
			],
		});
	}

	/** Pulls the balance and shows it to the user in an embed. */
	async balance(target) {
		const fetchTarget = await this.fetchProvidedTarget(target);
		const member = target || this.getUser(target.id);
		const economyUser = member ? fetchTarget : null;

		const [balance, bank] = [
			await fetchTarget.balance.get(),
			await fetchTarget.bank.get(),
		];

		const userName = await this.getUser(economyUser.id);

		return this.interaction.editReply({
			embeds: [
				this.embed.setDescription(
					`**${userName}'s Wallet**\n
            **Runner Coins:** ${balance || 0}\n**Stored Runner Coins:** ${
	bank || 0
}`,
				),
			],
		});
	}

	/** Deposits coins to your EdgeBank account. */
	async deposit(amount) {
		const ecoUser = await this.fetchUser();
		const userBalance = await ecoUser.balance.get();

		if (userBalance < amount || !userBalance) {
			return this.interaction.editReply({
				embeds: [
					this.embed.setDescription(
						'🔹 | The amount you provided exceeds or is below the amount of coins you have.',
					),
				],
			});
		}

		await ecoUser.balance.subtract(amount, `deposited ${amount} RC.`);
		await ecoUser.bank.add(amount, `deposited ${amount} RC.`);

		return this.interaction.editReply({
			embeds: [
				this.embed.setDescription(
					`🔹 | ${amount} RC has been deposited to your EdgeBank account!`,
				),
			],
		});
	}

	/** Shows your purchase history. */
	async history() {
		const ecoHistory = await this.getHistory();
		const userHistory = await ecoHistory.filter((item) => !item.custom.hidden);

		if (!userHistory.length) {
			return this.interaction.editReply({
				embeds: [
					this.embed.setDescription('🔹 | You haven\'t purchased any items.'),
				],
			});
		}

		return this.interaction.editReply({
			embeds: [
				this.embed
					.setTitle(`${this.interaction.user.username}'s Purchase History`)
					.setDescription(
						userHistory
							.map(
								(item) =>
									`**x${item.quantity} ${item.custom.emoji} ${item.name}** - ` +
									`**${item.price}** coins (**${item.date}**)`,
							)
							.join('\n'),
					),
			],
		});
	}

	/** Shows the richest users of a specific server. */
	async leaderboard() {
		const ecoGuild = await this.getGuild();
		const rawLB = await ecoGuild.leaderboards.money();
		const leaderboard = rawLB
			.filter((lb) => !this.getUser(lb.userID)?.bot)
			.filter((lb) => !!lb.money);

		if (!leaderboard.length) {
			return this.interaction.editReply({
				embeds: [
					this.embed.setDescription(
						'🔹 | There are no users on the leaderboard.',
					),
				],
				ephemeral: true,
			});
		}

		return this.interaction.editReply({
			embeds: [
				this.embed
					.setTitle(`${this.interaction.guild.name} | Money Leaderboard`)
					.setDescription(
						`${leaderboard
							.map(
								(lb, index) =>
									`${index + 1} - <@${lb.userID}> - **${lb.money}** RC`,
							)
							.join('\n')}`,
					),
			],
		});
	}

	/** Shows your inventory. */
	async inventory() {
		const userInventory = await this.getInventory();
		const filterInventory = userInventory.filter((item) => !item.custom.hidden);
		const serverShop = await this.getShop();

		if (filterInventory.length) {
			return this.interaction.editReply({
				embeds: [this.embed.setDescription('🔹 | You don\'t have any items.')],
			});
		}

		const cleanInventory = [
			...new Set(filterInventory.map((item) => item.name)),
		]
			.map((itemName) =>
				serverShop.find((shopItem) => shopItem.name == itemName),
			)
			.map((item) => {
				const quantity = filterInventory.filter(
					(invItem) => invItem.name == item.name,
				).length;

				return {
					quantity,
					totalPrice: item.price * quantity,
					item,
				};
			});

		console.log(cleanInventory);

		return this.interaction.editReply({
			embeds: [
				this.embed
					.setTitle(`${this.interaction.user.username}'s Inventory`)
					.setDescription(
						`${cleanInventory.map(
							(data, index) =>
								`${index + 1} - **x${data.quantity} ${
									data.item.custom.emoji
								} ` +
								`${data.item.name}** (ID: **${data.item.name}**) ` +
								`for **${data.totalPrice}** coins`,
						)}`,
					)
					.join('\n'),
			],
		});
	}

	/** Adds the weekly amount to your account. */
	async weekly() {
		const ecoUser = await this.fetchUser();
		const weeklyResult = await ecoUser.rewards.getWeekly();

		if (weeklyResult.cooldown) {
			const cooldownTime = weeklyResult.cooldown.time;
			let cooldownTimeString = '';

			if (cooldownTime.days) {
				cooldownTimeString += `**${cooldownTime.days}** days,`;
			}
			if (cooldownTime.days || cooldownTime.hours) {
				cooldownTimeString += `**${cooldownTime.hours}** hours, `;
			}

			if (cooldownTime.hours || cooldownTime.minutes) {
				cooldownTimeString += `**${cooldownTime.minutes}** minutes, `;
			}

			cooldownTimeString += `**${cooldownTime.seconds}** seconds`;

			return this.interaction.editReply({
				embeds: [
					this.embed.setDescription(
						`🔹 | ${this.interaction.user}, you can claim your daily reward in ${cooldownTimeString}!`,
					),
				],
			});
		}

		return this.interaction.editReply({
			embeds: [
				this.embed.setDescription(
					`🔹 | ${weeklyResult.reward} RC has been added to your account!`,
				),
			],
		});
	}

	/** Transfers money to another user. */
	async transfer(target, amount) {
		this.amount = amount;
		this.target = target;

		const ecoUser = await this.fetchUser();
		const providedTarget = await this.fetchProvidedTarget(this.target);

		const senderBalance = await ecoUser.balance.get();

		if (senderBalance < amount) {
			return this.interaction.editReply({
				embeds: [
					this.embed.setDescription(
						'🔹 | The amount you provided exceeds the amount of coins you have.',
					),
				],
			});
		}

		const transferringResult = await providedTarget.balance.transfer({
			amount: amount,
			senderMemberID: this.interaction.user.id,
			sendingReason: `Transfered ${amount} RC to ${await this.getUser(
				providedTarget.id,
			).tag}.`,
			receivingReason: `Received ${amount} RC from ${this.interaction.user.tag}.`,
		});

		return this.interaction.editReply({
			embeds: [
				this.embed.setDescription(
					`🔹 | Transaction completed. You have successfully transferred **${
						transferringResult.amount
					}** RC to ${await this.getUser(providedTarget.id)}.`,
				),
			],
		});
	}

	/** Withdraws an amount of money from your EdgeBank Virtual CC. */
	async withdraw(amount) {
		const ecoUser = await this.fetchUser();
		const userBalance = await ecoUser.bank.get();

		if (userBalance < amount || !userBalance) {
			return this.interaction.editReply({
				embeds: [
					this.embed.setDescription(
						'🔹 | The amount you provided exceeds or is below the amount of coins you have.',
					),
				],
			});
		}

		await ecoUser.balance.subtract(amount, `deposited ${amount} RC.`);
		await ecoUser.bank.add(amount, `deposited ${amount} RC.`);

		return this.interaction.editReply({
			embeds: [
				this.embed.setDescription(
					`🔹 | ${amount} RC has been withdrawn from your EdgeBank account!`,
				),
			],
		});
	}

	/** Works and puts a nice amount of RC into your wallet. */
	async work() {
		const ecoUser = await this.fetchUser();
		const workResult = await ecoUser.rewards.getWork();

		if (workResult.cooldown) {
			const cooldownTime = workResult.cooldown.time;
			let cooldownTimeString = '';

			if (cooldownTime.days) {
				cooldownTimeString += `**${cooldownTime.days}** days,`;
			}
			if (cooldownTime.days || cooldownTime.hours) {
				cooldownTimeString += `**${cooldownTime.hours}** hours, `;
			}

			if (cooldownTime.hours || cooldownTime.minutes) {
				cooldownTimeString += `**${cooldownTime.minutes}** minutes, `;
			}

			cooldownTimeString += `**${cooldownTime.seconds}** seconds`;

			return this.interaction.editReply({
				embeds: [
					this.embed.setDescription(
						`🔹 | ${this.interaction.user}, you can work again in ${cooldownTimeString}!`,
					),
				],
			});
		}

		return this.interaction.editReply({
			embeds: [
				this.embed.setDescription(
					`🔹 | You ran a Time Trial in Edge City and not only did you get 1st place but you also got paid ${workResult.reward} RC for your amazing performance.`,
				),
			],
		});
	}
};
