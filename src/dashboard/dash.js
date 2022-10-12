async function dash(client) {
  (async () => {
    const {
      ChannelType,
      ActionRowBuilder,
      ButtonBuilder,
      ButtonStyle,
    } = require("discord.js");
    const { GuildText, GuildCategory } = ChannelType;
    const session = require("express-session");
    const MongoDBStore = require("connect-mongodb-session")(session);
    const DBD = require("discord-dashboard");
    const SoftUI = require("dbd-soft-ui");
    const GDB = require("../structures/schemas/guild.js");
    const {
      clientID,
      clientSecret,
      DBDLicense,
      database,
      redirectUri,
      domain,
      ownerIDs,
    } = require("../structures/config.json");

    await DBD.useLicense(DBDLicense);
    DBD.Dashboard = DBD.UpdatedClass();

    const Dashboard = new DBD.Dashboard({
      port: 80,
      client: {
        id: clientID,
        secret: clientSecret,
      },
      redirectUri: redirectUri,
      domain: domain,
      ownerIDs: ownerIDs,
      bot: client,
      sessionStore: new MongoDBStore({
        uri: database,
        collection: "dashSessions",
      }),
      theme: SoftUI({
        customThemeOptions: {
          index: async ({ req, res, config }) => {
            return {
              values: [],
              graph: {},
              cards: [],
            };
          },
        },
        websiteName: "Evelyn",
        colorScheme: "pink",
        supporteMail: "hi@cryolabs.ml",
        icons: {
          favicon: "https://i.imgur.com/0eXmmD9.png",
          noGuildIcon: "https://i.imgur.com/mtrlifm.jpg",
          sidebar: {
            darkUrl: "https://i.imgur.com/unSOlT9.png",
            lightUrl: "https://i.imgur.com/unSOlT9.png",
            hideName: true,
            borderRadius: false,
            alignCenter: true,
          },
        },
        locales: {
          enUS: {
            name: "English",
            index: {
              feeds: [
                "Current Users",
                "CPU",
                "System Platform",
                "Server Count",
              ],
              card: {
                category: "this",
                title: "should",
                description: "update just fine. you know?",
              },
              feedsTitle: "Feeds",
              graphTitle: "Graphs",
            },
          },
        },
        preloader: {
          spinner: true,
          text: "This page is currently loading.",
        },
        index: {
          card: {
            link: {},
          },
          graph: {
            enabled: true,
            lineGraph: false,
            title: "Memory Usage",
            tag: "Memory (MB)",
            max: 100,
          },
        },
        sweetalert: {
          errors: {},
          success: {
            login: "Successfully logged in.",
          },
        },
        error: {
          error404: {
            title: "404",
            subtitle: "Welcome to the Backrooms.",
            description:
              "The user wondered off so far into the abyss they found the almighty 404 page. Now, it would be a pretty good idea to go back the way they came before they become even more lost by pressing the button below.",
          },
          dbdError: {
            disableSecretMenu: false,
            secretMenuCombination: ["69", "82", "82", "79", "82"],
          },
        },
        commands: [],
      }),
      settings: [
        {
          categoryId: "logs",
          categoryName: "Logging",
          categoryDescription:
            "Empower your server with our powerful logging solution.",
          categoryOptionsList: [
            {
              optionId: "logswitch",
              optionName: "Enable/Disable Logging",
              optionDescription: "Enable or disable logging.",
              optionType: DBD.formTypes.switch(false),
              getActualSet: async ({ guild }) => {
                const data = await GDB.findOne({ id: guild.id });
                const savedData = data.logs?.enabled;
                const defaultState = false;
                return savedData === null || savedData == undefined
                  ? defaultState
                  : savedData;
              },
              setNew: async ({ guild, newData }) => {
                const data = await GDB.findOne({ id: guild.id });
                data.logs.enabled = newData;
                data.save();
                return;
              },
            },
            {
              optionId: "logchannel",
              optionName: "Log Channel",
              optionDescription: "Set the logs channel.",
              optionType: DBD.formTypes.channelsSelect(
                false,
                (channelTypes = [GuildText])
              ),
              getActualSet: async ({ guild }) => {
                const data = await GDB.findOne({ id: guild.id });
                const savedData = data.logs.channel || null;
                const defaultState = false;
                return savedData === null || savedData == undefined
                  ? defaultState
                  : savedData;
              },
              setNew: async ({ guild, newData }) => {
                const data = await GDB.findOne({ id: guild.id });
                data.logs.channel = newData;
                data.save();
                return;
              },
            },
          ],
        },
        {
          categoryId: "wl_gbye",
          categoryName: "Welcome / Goodbye",
          categoryDescription: "A fully fledged welcoming system.",
          categoryOptionsList: [
            {
              optionId: "wlswitch",
              optionName: "Enable/Disable welcoming",
              optionDescription: "Enable or disable the welcome message.",
              optionType: DBD.formTypes.switch(false),
              getActualSet: async ({ guild }) => {
                const data = await GDB.findOne({ id: guild.id });
                const savedData = data.welcome.enabled;
                const defaultState = false;
                return savedData === null || savedData == undefined
                  ? defaultState
                  : savedData;
              },
              setNew: async ({ guild, newData }) => {
                const data = await GDB.findOne({ id: guild.id });
                data.welcome.enabled = newData;
                data.save();
                return;
              },
            },
            {
              optionId: "wl_channel",
              optionName: "Welcome Channel",
              optionDescription:
                "Set the channel where the welcome message will be sent in.",
              optionType: DBD.formTypes.channelsSelect(
                false,
                (channelTypes = [GuildText])
              ),
              getActualSet: async ({ guild }) => {
                const data = await GDB.findOne({ id: guild.id });
                const savedData = data.welcome.channel || null;
                const defaultState = false;
                return savedData === null || savedData == undefined
                  ? defaultState
                  : savedData;
              },
              setNew: async ({ guild, newData }) => {
                const data = await GDB.findOne({ id: guild.id });
                data.welcome.channel = newData;
                data.save();
                return;
              },
            },
            {
              optionId: "welcome_message",
              optionName: "Welcome Message",
              optionDescription:
                "Sends a message alongside the welcome embed! This is not suitable for full welcome messages as it does not replace anything with user mentions, tags, etc. This is only for a small message to be sent alongside the embed.",
              optionType: DBD.formTypes.textarea(
                "Set the welcome message here.",
                null,
                100,
                false,
                false
              ),
              getActualSet: async ({ guild }) => {
                const data = await GDB.findOne({ id: guild.id });
                const savedData = data.welcome.message || null;
                return savedData;
              },
              setNew: async ({ guild, newData }) => {
                const data = await GDB.findOne({ id: guild.id });
                data.welcome.message = newData;
                data.save();
                return;
              },
            },
            {
              optionId: "gbswitch",
              optionName: "Enable/Disable the goodbye message.",
              optionDescription: "Enable or disable the goodbye message.",
              optionType: DBD.formTypes.switch(false),
              getActualSet: async ({ guild }) => {
                const data = await GDB.findOne({ id: guild.id });
                const savedData = data.goodbye.enabled;
                const defaultState = false;
                return savedData === null || savedData == undefined
                  ? defaultState
                  : savedData;
              },
              setNew: async ({ guild, newData }) => {
                const data = await GDB.findOne({ id: guild.id });
                data.goodbye.enabled = newData;
                data.save();
                return;
              },
            },
            {
              optionId: "gb_channel",
              optionName: "Goodbye Channel",
              optionDescription:
                "Set the channel where the goodbye message will be sent in.",
              optionType: DBD.formTypes.channelsSelect(false, [GuildText]),
              getActualSet: async ({ guild }) => {
                const data = await GDB.findOne({ id: guild.id });
                const savedData = data.goodbye.channel || null;
                const defaultState = false;
                return savedData === null || savedData == undefined
                  ? defaultState
                  : savedData;
              },
              setNew: async ({ guild, newData }) => {
                const data = await GDB.findOne({ id: guild.id });
                data.goodbye.channel = newData;
                data.save();
                return;
              },
            },
            {
              optionId: "goodbye_message",
              optionName: "Goodbye Message",
              optionDescription:
                "Sends a message alongside the goodbye embed! This is not suitable for full welcome messages as it does not replace anything with user mentions, tags, etc. This is only for a small message to be sent alongside the embed.",
              optionType: DBD.formTypes.textarea(
                "Set the goodbye message here.",
                null,
                100,
                false,
                false
              ),
              getActualSet: async ({ guild }) => {
                const data = await GDB.findOne({ id: guild.id });
                const savedData = data.goodbye.message || null;
                return savedData;
              },
              setNew: async ({ guild, newData }) => {
                const data = await GDB.findOne({ id: guild.id });
                data.goodbye.message = newData;
                data.save();
                return;
              },
            },
            {
              optionId: "goodbyeemb",
              optionName: "Goodbye Embed",
              optionDescription:
                "Configure the embed that will be sent once someone leaves.",
              optionType: DBD.formTypes.embedBuilder({
                username: client.user.username,
                avatarURL: client.user.avatarURL({ dynamic: true }),
                defaultJson: {
                  embed: {
                    description: `Farewell, {user.username}!\nWe welcome you back with open arms if you decide to return.`,
                    footer: {
                      text: "This is a sample message. Change it to your liking.",
                    },
                  },
                },
              }),
              getActualSet: async ({ guild }) => {
                const data = await GDB.findOne({ id: guild.id });
                return data.goodbye.json;
              },
              setNew: async ({ guild, newData }) => {
                const data = await GDB.findOne({ id: guild.id });
                data.goodbye.json = newData;
                data.save();
                return;
              },
            },
          ],
        },
        {
          categoryId: "tickets",
          categoryName: "Tickets",
          categoryDescription:
            "Make assisting other users easier with our ticket support system.",
          categoryOptionsList: [
            {
              optionId: "ticketswitch",
              optionName: "Enable/Disable Tickets",
              optionDescription: "Enable or disable tickets.",
              optionType: DBD.formTypes.switch(false),
              getActualSet: async ({ guild }) => {
                const data = await GDB.findOne({ id: guild.id });
                const savedData = data.tickets.enabled;
                const defaultState = false;
                return savedData === null || savedData == undefined
                  ? defaultState
                  : savedData;
              },
              setNew: async ({ guild, newData }) => {
                const data = await GDB.findOne({ id: guild.id });
                data.tickets.enabled = newData;
                data.save();
                return;
              },
            },
            {
              optionId: "ticketchannel",
              optionName: "Ticket Channel",
              optionDescription:
                "Set the channel where the ticket panel embed will be sent.",
              optionType: DBD.formTypes.channelsSelect(
                false,
                (channelTypes = [GuildText])
              ),
              getActualSet: async ({ guild }) => {
                const data = await GDB.findOne({ id: guild.id });
                return data.tickets?.channel || null;
              },
              setNew: async ({ guild, newData }) => {
                const data = await GDB.findOne({ id: guild.id });
                data.tickets.channel = newData;
                data.save();
                return;
              },
            },
            {
              optionId: "ticketcategory",
              optionName: "Ticket Category",
              optionDescription:
                "Select the category where the ticket channels will be created.",
              optionType: DBD.formTypes.channelsSelect(
                false,
                (channelTypes = [GuildCategory])
              ),
              getActualSet: async ({ guild }) => {
                const data = await GDB.findOne({ id: guild.id });
                return data.tickets.category || null;
              },
              setNew: async ({ guild, newData }) => {
                const data = await GDB.findOne({ id: guild.id });
                data.tickets.category = newData || null;
                data.save();
                return;
              },
            },
            {
              optionId: "tickettranscripts",
              optionName: "Ticket Transcripts",
              optionDescription:
                "Select the channel where the transcripts will be sent.",
              optionType: DBD.formTypes.channelsSelect(
                false,
                (channelTypes = [GuildText])
              ),
              getActualSet: async ({ guild }) => {
                const data = await GDB.findOne({ id: guild.id });
                return data.tickets.transcriptChannel || null;
              },
              setNew: async ({ guild, newData }) => {
                const data = await GDB.findOne({ id: guild.id });
                data.tickets.transcriptChannel = newData;
                data.save();
                return;
              },
            },
            {
              optionId: "tickethandlers",
              optionName: "Ticket Handlers",
              optionDescription:
                "Select the role which will be pinged to handle tickets.",
              optionType: DBD.formTypes.rolesSelect(false),
              getActualSet: async ({ guild }) => {
                const data = await GDB.findOne({ id: guild.id });
                return data.tickets.ticketHandlers || null;
              },
              setNew: async ({ guild, newData }) => {
                const data = await GDB.findOne({ id: guild.id });
                data.tickets.ticketHandlers = newData || null;
                data.save();
                return;
              },
            },
            {
              optionId: "tpembed",
              optionName: "Ticket Panel Embed",
              optionDescription:
                "Configure the embed that will be included in the panel.",
              optionType: DBD.formTypes.embedBuilder({
                username: client.user.username,
                avatarURL: client.user.avatarURL({ dynamic: true }),
                defaultJson: {
                  embed: {
                    timestamp: new Date().toISOString(),
                    description: "Need help? Open a ticket!",
                    author: {
                      name: "Evelyn | Ticketing System",
                      url: "https://evelynbot.ml",
                    },
                    footer: {
                      text: "This is a footer, change it to your liking.",
                    },
                    fields: [
                      {
                        name: "Hello",
                        value: "This is a field.",
                      },
                      {
                        name: "Hello 2",
                        value: "This is a field.",
                        inline: false,
                      },
                    ],
                  },
                },
              }),
              getActualSet: async ({ guild }) => {
                const data = await GDB.findOne({ id: guild.id });
                return data.tickets.panelJSON;
              },
              setNew: async ({ guild, newData }) => {
                const data = await GDB.findOne({ id: guild.id });
                data.tickets.panelJSON = newData || null;
                await data.save();

                const channel = data.tickets?.channel;
                if (channel) {
                  const tpChannel = client.channels.cache.get(channel);

                  const buttons = new ActionRowBuilder();
                  buttons.addComponents(
                    new ButtonBuilder()
                      .setCustomId("createTicket")
                      .setLabel("Open a Ticket")
                      .setEmoji("📩")
                      .setStyle(ButtonStyle.Primary)
                  );

                  tpChannel.send({
                    embeds: [data.tickets.panelJSON.embed],
                    components: [buttons],
                  });
                }
                return;
              },
            },
          ],
        },
        {
          categoryId: "levels",
          categoryName: "Leveling",
          categoryDescription:
            "Make chatting more rewarding by enabling the leveling system.",
          categoryOptionsList: [
            {
              optionId: "levelToggle",
              optionName: "Enable/Disable Leveling",
              optionDescription: "Enable or disable the leveling system.",
              optionType: DBD.formTypes.switch(false),
              getActualSet: async ({ guild }) => {
                const data = await GDB.findOne({ id: guild.id });
                const savedData = data.levels?.enabled;
                const defaultState = false;
                return savedData === null || savedData == undefined
                  ? defaultState
                  : savedData;
              },
              setNew: async ({ guild, newData }) => {
                const data = await GDB.findOne({ id: guild.id });
                data.levels.enabled = newData;
                data.save();
                return;
              },
            },
            {
              optionId: "levelChannel",
              optionName: "Level Channel",
              optionDescription:
                "Set the channel where level up messages will be sent.",
              optionType: DBD.formTypes.channelsSelect(
                false,
                (channelTypes = [GuildText])
              ),
              getActualSet: async ({ guild }) => {
                const data = await GDB.findOne({ id: guild.id });
                const savedData = data.levels.channel || null;
                const defaultState = false;
                return savedData === null || savedData == undefined
                  ? defaultState
                  : savedData;
              },
              setNew: async ({ guild, newData }) => {
                const data = await GDB.findOne({ id: guild.id });
                data.levels.channel = newData;
                data.save();
                return;
              },
            },
            {
              optionId: "xp_message",
              optionName: "Level Up Message",
              optionDescription: "Sets the Level Up message.",
              optionType: DBD.formTypes.textarea(
                "🎉 Congrats, {userMention}! You have levelled up to {userLevel}! 🎉",
                null,
                100,
                false,
                false
              ),
              getActualSet: async ({ guild }) => {
                const data = await GDB.findOne({ id: guild.id });
                const savedData = data.levels.message || null;
                return savedData;
              },
              setNew: async ({ guild, newData }) => {
                const data = await GDB.findOne({ id: guild.id });
                data.levels.message = newData;
                data.save();
                return;
              },
            },
          ],
        },
      ],
    });
    Dashboard.init();
  })();
}

module.exports = { dash };
