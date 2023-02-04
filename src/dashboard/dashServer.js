const DBD = require('discord-dashboard');
const { Client } = require("discord.js");
const SoftUI = require('dbd-soft-ui');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const { settings } = require("./theme/settings.js");
const { index } = require("./theme/customThemeOptions.js");
const enUS_locale = require("./theme/locales/en_US.json");

module.exports = {
	/** Creates a new instance of the Discord Dashboard class, used to enable Evelyn's web dashboard.
	 * @param {Client} client - The Discord.js client object. 
	*/
	dash: function (client) {
		(async () => {
			await DBD.useLicense(client.config.dash.DBDLicense);
			DBD.Dashboard = DBD.UpdatedClass();

			const dash = new DBD.Dashboard({
				port: 80,
				client: {
					id: client.config.clientID,
					secret: client.config.clientSecret,
				},
				redirectUri: client.config.dash.redirectUri,
				domain: client.config.dash.domain,
				ownerIDs: client.config.ownerIDs,
				bot: client,
				sessionStore: new MongoDBStore({
					uri: client.config.database,
					collection: 'dashSessions',
				}),
				useTheme404: true,
				theme: SoftUI({
					customThemeOptions: {
						index: ({ req }) => {
							return index(client, req);
						}
					},
					websiteName: "Evelyn",
					colorScheme: "pink",
					icons: {
						favicon: "https://cdn.discordapp.com/avatars/832289090128969787/a6dbf8e910c7f3efbfef5dd83c56c69d.webp?size=2048",
						noGuildIcon: "https://i.imgur.com/mtrlifm.jpg",
						sidebar: {
							darkUrl: "https://cdn.discordapp.com/avatars/832289090128969787/a6dbf8e910c7f3efbfef5dd83c56c69d.webp?size=2048",
							lightUrl: "",
							hideName: true,
							borderRadius: false,
							alignCenter: true
						}
					},
					locales: enUS_locale,
					preloader: {
						spinner: true,
						text: "This page is currently loading."
					},
					index: {
						card: {
							link: {},
						},
						graph: {},
					},
					sweetalert: {
						errors: {},
						success: {
							login: "Welcome back, runner."
						}
					},
					error: {
						error404: {
							title: "404",
							subtitle: "Welcome to the Backrooms.",
							description: "The user wondered off so far into the abyss they found the almighty 404 page. Now, it would be a pretty good idea to go back the way they came before they become even more lost by pressing the button below."
						},
						dbdError: {
							disableSecretMenu: false,
							secretMenuCombination: ["69", "82", "82", "79", "82"]
						}
					},
					commands: []
				}),
				settings: settings(client),
			});
			dash.init();
		})();
	},
};
