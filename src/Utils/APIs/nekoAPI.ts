/**
 * This class contains our own custom version of a wrapper for the NekoBot API to reduce the amount of packages we're using.
 * This bares a lot of resemblence to the waifu.pics API wrapper we use in our /actions system but this one is tailored to the API we mentioned earlier.
 */
import superagent from 'superagent';
import { EmbedBuilder, ChatInputCommandInteraction, User } from 'discord.js';

export class NekoAPI {
	private apiURL: string;
	private embed: EmbedBuilder;
	private interaction: ChatInputCommandInteraction;
	private name: string;
	private iconURL: string;
	private target: User;
	private otherEmbed: EmbedBuilder;
	private user1: User;
	private user2: User;
	private target1: User;
	private target2: User;
	private text: string;

	/** Creates a new instance of the NekoAPI class. */
	constructor(interaction: ChatInputCommandInteraction) {
		this.apiURL = 'https://nekobot.xyz/api/imagegen';
		/** Base embed used to reduce repeated code. */
		this.embed = new EmbedBuilder()
			.setColor('Blurple')
			.setFooter({
				text: 'This image was brought to you by the NekoBot API.',
			})
			.setTimestamp();
		/** Base embed used for other purposes. */
		this.otherEmbed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		/** The interaction object used for replying and fetching usernames. */
		this.interaction = interaction;

		this.user1 = null;
		this.user2 = null;
	}

	/** Retrieves the image from the endpoint provided. */
	fetchImage(endpoint: string) {
		return new Promise((resolve, reject) => {
			superagent
				.get(`${this.apiURL}${endpoint}`)
				.then((res) => {
					resolve(res.body.message);
				})
				.catch((err: Error) => {
					reject(err);

					return this.interaction.editReply({
						embeds: [
							this.otherEmbed.setDescription(
								'🔹 | There was an error while fetching the image from the API.',
							),
						],
					});
				});
		});
	}

	/** Checks for a target user to display in the embed whenever a person needs to be mentioned. */
	checkTarget(user1: User, user2: User) {
		this.target1 = user1;
		this.target2 = user2;

		if (!this.target1) {
			return this.interaction.editReply({
				embeds: [
					this.otherEmbed.setDescription('🔹 | You forgot to provide a user.'),
				],
			});
		}
	}

	/** Checks for a text string before displaying in the embed whenever a person needs to be mentioned. */
	checkText(text: string) {
		this.text = text;

		if (!text) {
			return this.interaction.editReply({
				embeds: [
					this.otherEmbed.setDescription(
						'🔹 | You forgot to provide some text.',
					),
				],
			});
		}
	}

	/** Fetches the avatars of users. */
	fetchAvatars(user1: User, user2: User) {
		if (this.checkTarget(user1, user2)) return;

		this.user1 = user1;
		this.user2 = user2;

		const avatarFetch = (user1 || user2).avatarURL();
		return avatarFetch;
	}

	/** Fetches the usernames of users. */
	fetchUsername(user1: User, user2: User) {
		if (this.checkTarget(user1, user2)) return;

		this.user1 = user1;
		this.user2 = user2;

		const fetchName = (user1 || user2).username;
		return fetchName;
	}

	/** Fetches the image and replies with it in an embed. */
	async fetchandSend(
		type: string,
		user1?: User,
		user2?: User,
		params?: string,
	) {
		if (user1 && user2) this.checkTarget(user1, user2);

		const image = (await this.fetchImage(`?type=${type}&${params}`)) as string;
		return this.interaction.editReply({ embeds: [this.embed.setImage(image)] });
	}

	/** Fetches the awooified image from the API and replies with an embed of it. */
	awooify(user1: User, user2: User) {
		return this.fetchandSend(
			'awooify',
			user1,
			user2,
			`url=${this.fetchAvatars(user1, user2)}`,
		);
	}

	/** Fetches the baguette image from the API and replies with an embed of it. */
	baguette(user1: User, user2: User) {
		return this.fetchandSend(
			'baguette',
			user1,
			user2,
			`url=${this.fetchAvatars(user1, user2)}`,
		);
	}

	/** Fetches the blurpified image from the API and replies with an embed of it. */
	blurpify(user1: User, user2: User) {
		return this.fetchandSend(
			'blurpify',
			user1,
			user2,
			`url=${this.fetchAvatars(user1, user2)}`,
		);
	}

	/** Fetches the captcha image from the API and replies with an embed of it. */
	captcha(user1: User, user2: User) {
		return this.fetchandSend(
			'captcha',
			user1,
			user2,
			`url=${this.fetchAvatars(user1, user2)}&username=${this.fetchUsername(
				user1,
				user2,
			)}`,
		);
	}

	/** Fetches the change my mind image from the API and replies with an embed of it. */
	changemymind(text: string) {
		if (this.checkText(text)) return;
		return this.fetchandSend('changemymind', null, null, `text=${text}`);
	}

	/** Fetches the deepfried image from the API and replies with an embed of it. */
	deepfry(user1: User, user2: User) {
		return this.fetchandSend(
			'deepfry',
			user1,
			user2,
			`url=${this.fetchAvatars(user1, user2)}`,
		);
	}

	/** Fetches the kanna image from the API and replies with an embed of it. */
	kannagen(text: string) {
		if (this.checkText(text)) return;
		return this.fetchandSend('kannagen', null, null, `text=${text}`);
	}

	/** Fetches the PH image from the API and replies with an embed of it. */
	phcomment(user1: User, user2: User, text: string) {
		if (this.checkText(text)) return;

		return this.fetchandSend(
			'phcomment',
			user1,
			user2,
			`username=${this.fetchUsername(user1, user2)}&image=${this.fetchAvatars(
				user1,
				user2,
			)}&text=${text}`,
		);
	}

	/** Fetches the threats image from the API and replies with an embed of it. */
	threats(user1: User, user2: User) {
		return this.fetchandSend(
			'threats',
			user1,
			user2,
			`url=${this.fetchAvatars(user1, user2)}`,
		);
	}

	/** Fetches the trash image from the API and replies with an embed of it. */
	trash(user1: User, user2: User) {
		return this.fetchandSend(
			'threats',
			user1,
			user2,
			`image=${this.fetchAvatars(user1, user2)}`,
		);
	}

	/** Fetches the trump tweet image from the API and replies with an embed of it. */
	trumptweet(text: string) {
		if (this.checkText(text)) return;
		return this.fetchandSend('trumptweet', null, null, `text=${text}`);
	}

	/** Fetches the tweet image from the API and replies with an embed of it. */
	tweet(user1: User, user2: User, text: string) {
		if (this.checkText(text)) return;

		return this.fetchandSend(
			'tweet',
			user1,
			user2,
			`username=${this.fetchUsername(user1, user2)}&text=${text}`,
		);
	}
}
