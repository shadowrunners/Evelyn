async function dash(client) {
  (async () => {
    const {
      ChannelType,
      ActionRowBuilder,
      ButtonBuilder,
      ButtonStyle,
      InteractionCollector,
    } = require("discord.js");
    const { GuildText, GuildCategory } = ChannelType;
    const session = require("express-session");
    const MongoDBStore = require("connect-mongodb-session")(session);
    const DBD = require("discord-dashboard");
    const DarkDashboard = require("dbd-dark-dashboard");
    const GDB = require("../structures/schemas/guild.js");
    const {
      clientID,
      clientSecret,
      DBDLicense,
      database,
      redirectUri,
      domain,
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
      bot: client,
      sessionStore: new MongoDBStore({
        uri: database,
        collection: "dashSessions",
      }),
      theme: DarkDashboard({
        information: {
          createdBy: "CryoLabs",
          websiteTitle: "Evelyn",
          websiteName: "Evelyn",
          websiteUrl: "https://evelynbot.ml/",
          dashboardUrl: "http://localhost:3000/",
          supporteMail: "hi@cryolabs.ml",
          supportServer: "https://discord.gg/HwkDSs7X82",
          imageFavicon: "https://i.imgur.com/0eXmmD9.png",
          iconURL: "https://i.imgur.com/0eXmmD9.png",
          loggedIn: "Successfully signed in.",
          mainColor: "#808080",
          subColor: "#FFFFFF",
          preloader: "Loading.",
        },

        index: {
          card: {
            category: "Evelyn | Control Center",
            title: `Welcome to Evelyn's control center, the one stop shop for customization and settings regarding our bot.`,
            image: "https://i.imgur.com/YPkwGBI.png",
          },

          information: {},
          feeds: {},
        },

        commands: [
          {
            category: `Starting Up`,
            subTitle: `All helpful commands`,
            list: [
              {
                commandName: "bug",
                commandUsage: `;bug <bug>`,
                commandDescription: `test`,
                commandAlias: "No aliases",
              },
              {
                commandName: "2nd command",
                commandUsage: "oto.nd <arg> <arg2> [op]",
                commandDescription: "Lorem ipsum dolor sth, arg sth arg2 stuff",
                commandAlias: "Alias",
              },
              {
                commandName: "Test command",
                commandUsage: "prefix.test <arg> [op]",
                commandDescription: "Lorem ipsum dolor sth",
                commandAlias: "Alias",
              },
            ],
          },
        ],
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
                return savedData == null || savedData == undefined
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
                return savedData == null || savedData == undefined
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
              optionType: "spacer",
              title: "Welcome Embed Configuration",
              description:
                "This section contains the configuration for the welcome embed. Scroll down for the goodbye embed configuration.",
            },
            {
              optionId: "wlswitch",
              optionName: "Enable/Disable welcoming",
              optionDescription: "Enable or disable the welcome message.",
              optionType: DBD.formTypes.switch(false),
              getActualSet: async ({ guild }) => {
                const data = await GDB.findOne({ id: guild.id });
                const savedData = data.welcome.enabled;
                const defaultState = false;
                return savedData == null || savedData == undefined
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
                return savedData == null || savedData == undefined
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
              optionId: "welcomeemb",
              optionName: "Welcome Embed",
              optionDescription:
                "Configure the embed that will be sent once someone joins.",
              optionType: DBD.formTypes.embedBuilder({
                username: client.user.username,
                avatarURL: client.user.avatarURL({ dynamic: true }),
                defaultJson: {
                  embed: {
                    description: `Welcome, {user.username}!\n\nPlease read the rules and have fun!`,
                    footer: {
                      text: "This is a sample message. Change it to your liking.",
                    },
                  },
                },
              }),
              getActualSet: async ({ guild }) => {
                const data = await GDB.findOne({ id: guild.id });
                return data.welcome.json;
              },
              setNew: async ({ guild, newData }) => {
                const data = await GDB.findOne({ id: guild.id });
                data.welcome.json = newData;
                data.save();
                return;
              },
            },
            {
              optionType: "spacer",
              title: "Goodbye Embed Configuration",
              description:
                "This section contains the configuration for the goodbye embed.",
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
                return savedData == null || savedData == undefined
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
                return savedData == null || savedData == undefined
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
              optionType: "spacer",
              title: "Ticket System Configuration",
              description:
                "This section contains the configuration for the welcome embed. Scroll down for the goodbye embed configuration.",
            },
            {
              optionId: "ticketswitch",
              optionName: "Enable/Disable Tickets",
              optionDescription: "Enable or disable tickets.",
              optionType: DBD.formTypes.switch(false),
              getActualSet: async ({ guild }) => {
                const data = await GDB.findOne({ id: guild.id });
                const savedData = data.tickets.enabled;
                const defaultState = false;
                return savedData == null || savedData == undefined
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
              optionType: "spacer",
              title: "Ticket Embed Configuration",
              description:
                "This section contains the configuration for the ticket panel embed. Scroll down for the per-ticket embed configuration.",
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
      ],
    });
    Dashboard.init();
  })();
}

module.exports = { dash };
