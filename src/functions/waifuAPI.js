/**
 * This class contains our own custom version of a wrapper for the waifu.pics API to reduce the amount of packages we're using.
 */
const { get } = require('superagent');
const { EmbedBuilder } = require('discord.js');

module.exports = class WaifuEngine {
	/** Creates a new instance of the Waifu Engine class. */
	constructor(interaction) {
		/** API URL for waifu.pics. */
		this.apiURL = 'https://api.waifu.pics/sfw/';
		/** Base embed used to reduce repeated code. */
		this.embed = new EmbedBuilder()
			.setColor('Blurple')
			.setFooter({
				text: 'This image was brought to you by the waifu.pics API.',
			})
			.setTimestamp();
		/** The interaction object used for replying and fetching usernames. */
		this.interaction = interaction;
	}

	/** Retrieves the image from the endpoint provided. */
	fetchImage(endpoint) {
		return new Promise((resolve, reject) => {
			get(`${this.apiURL}${endpoint}`)
				.then((res) => {
					resolve(res.body.url);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	/** Checks for a target user to display in the embed whenever a person needs to be mentioned. */
	checkTarget(target) {
		this.target = target;

		if (!this.target) {
			return this.interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setColor('Blurple')
						.setDescription('🔹 | You forgot to provide a user.'),
				],
			});
		}
	}

	/** Fetches the image and replies with it in an embed. */
	async reply(action, text, target) {
		if (target) {
			if (this.checkTarget(target)) return;
		}

		const image = await this.fetchImage(action);
		let name, iconURL;

		if (target) {
			name = `${this.interaction.user.username} ${text} ${target.username}`;
			iconURL = `${this.interaction.user.avatarURL()}`;
		}
		else {
			name = `${this.interaction.user.username} ${text}`;
			iconURL = `${this.interaction.user.avatarURL()}`;
		}

		return this.interaction.editReply({
			embeds: [
				this.embed.setAuthor({ name: name, iconURL: iconURL }).setImage(image),
			],
		});
	}

	/** Fetches the biting images from the API and replies with an embed of it. */
	bite(target) {
		return this.reply('bite', 'bites', target);
	}

	/** Fetches blushing images from the API and replies with an embed of it. */
	blush() {
		return this.reply('blush', 'blushes');
	}

	/** Fetches bonk images from the API and replies with an embed of it. */
	bonk(target) {
		return this.reply('bonk', 'bonks', target);
	}

	/** Fetches bully images from the API and replies with an embed of it. */
	bully(target) {
		return this.reply('bully', 'bullies', target);
	}

	/** Fetches cringe images from the API and replies with an embed of it. */
	cringe() {
		return this.reply('cringe', 'thinks that\'s pretty cringe');
	}

	/** Fetches crying images from the API and replies with an embed of it. */
	cry() {
		return this.reply('cry', 'is crying... :c');
	}

	/** Fetches cuddling images from the API and replies with an embed of it. */
	cuddle(target) {
		return this.reply('cuddle', 'cuddles', target);
	}

	/** Fetches handholding images from the API and replies with an embed of it. */
	handhold(target) {
		return this.reply('handhold', 'is holding hands with', target);
	}

	/** Fetches highfive images from the API and replies with an embed of it. */
	highfive(target) {
		return this.reply('highfive', 'highfives', target);
	}

	/** Fetches hugging images from the API and replies with an embed of it. */
	hug(target) {
		return this.reply('hug', 'hugs', target);
	}

	/** Fetches kissing images from the API and replies with an embed of it. */
	kiss(target) {
		return this.reply('kiss', 'kisses', target);
	}

	/** Fetches patting images from the API and replies with an embed of it. */
	pat(target) {
		return this.reply('pat', 'pats', target);
	}

	/** Fetches poking images from the API and replies with an embed of it. */
	poke(target) {
		return this.reply('poke', 'pokes', target);
	}

	/** Fetches slapping images from the API and replies with an embed of it. */
	slap(target) {
		return this.reply('slap', 'slaps', target);
	}

	/** Fetches waving images from the API and replies with an embed of it. */
	wave(target) {
		return this.reply('waves', 'is waving at', target);
	}
};
