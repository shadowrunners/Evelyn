/** This class contains our own custom version of a wrapper for the waifu.pics API to reduce the amount of packages we're using. */
import { get } from 'superagent';
import { EmbedBuilder, ChatInputCommandInteraction, User } from 'discord.js';

export class WaifuEngine {
	private apiURL: string;
	private embed: EmbedBuilder;
	private interaction: ChatInputCommandInteraction;
	private name: string;
	private iconURL: string;
	private target: User;

	/** Creates a new instance of the NekoAPI class. */
	constructor(interaction: ChatInputCommandInteraction) {
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

		this.name = null;
		this.iconURL = null;
	}

	/** Retrieves the image from the endpoint provided. */
	private fetchImage(endpoint: string) {
		return new Promise((resolve, reject) => {
			get(`${this.apiURL}${endpoint}`)
				.then((res: { body: { url: unknown } }) => {
					resolve(res.body.url);
				})
				.catch((err: Error) => {
					reject(err);
				});
		});
	}

	/** Checks for a target user to display in the embed whenever a person needs to be mentioned. */
	private checkTarget(target: User) {
		this.target = target;

		if (!this.target)
			return this.interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setColor('Blurple')
						.setDescription('🔹 | You forgot to provide a user.'),
				],
			});
	}

	/** Fetches the image and replies with it in an embed. */
	private async reply(action: string, text: string, target?: User) {
		if (target) {
			if (this.checkTarget(target)) return;
		}

		const image = (await this.fetchImage(action)) as string;

		if (target) {
			this.name = `${this.interaction.user.username} ${text} ${target}`;
			this.iconURL = `${this.interaction.user.avatarURL()}`;
		}
		else {
			this.name = `${this.interaction.user.username} ${text}`;
			this.iconURL = `${this.interaction.user.avatarURL()}`;
		}

		return this.interaction.editReply({
			embeds: [
				this.embed
					.setAuthor({ name: this.name, iconURL: this.iconURL })
					.setImage(image),
			],
		});
	}

	/** Fetches the biting images from the API and replies with an embed of it. */
	public bite(target: User) {
		return this.reply('bite', 'bites', target);
	}

	/** Fetches blushing images from the API and replies with an embed of it. */
	public blush() {
		return this.reply('blush', 'blushes');
	}

	/** Fetches bonk images from the API and replies with an embed of it. */
	public bonk(target: User) {
		return this.reply('bonk', 'bonks', target);
	}

	/** Fetches bully images from the API and replies with an embed of it. */
	public bully(target: User) {
		return this.reply('bully', 'bullies', target);
	}

	/** Fetches cringe images from the API and replies with an embed of it. */
	public cringe() {
		return this.reply('cringe', 'thinks that\'s pretty cringe');
	}

	/** Fetches crying images from the API and replies with an embed of it. */
	public cry() {
		return this.reply('cry', 'is crying... :c');
	}

	/** Fetches cuddling images from the API and replies with an embed of it. */
	public cuddle(target: User) {
		return this.reply('cuddle', 'cuddles', target);
	}

	/** Fetches handholding images from the API and replies with an embed of it. */
	public handhold(target: User) {
		return this.reply('handhold', 'is holding hands with', target);
	}

	/** Fetches highfive images from the API and replies with an embed of it. */
	public highfive(target: User) {
		return this.reply('highfive', 'highfives', target);
	}

	/** Fetches hugging images from the API and replies with an embed of it. */
	public hug(target: User) {
		return this.reply('hug', 'hugs', target);
	}

	/** Fetches kissing images from the API and replies with an embed of it. */
	public kiss(target: User) {
		return this.reply('kiss', 'kisses', target);
	}

	/** Fetches patting images from the API and replies with an embed of it. */
	public pat(target: User) {
		return this.reply('pat', 'pats', target);
	}

	/** Fetches poking images from the API and replies with an embed of it. */
	public poke(target: User) {
		return this.reply('poke', 'pokes', target);
	}

	/** Fetches slapping images from the API and replies with an embed of it. */
	public slap(target: User) {
		return this.reply('slap', 'slaps', target);
	}

	/** Fetches waving images from the API and replies with an embed of it. */
	public wave(target: User) {
		return this.reply('waves', 'is waving at', target);
	}
}
