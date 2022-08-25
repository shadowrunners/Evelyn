async function dash(client) {
  (async () => {
    const { ChannelType } = require("discord.js");
    const { GuildText } = ChannelType;
    const DBD = require("discord-dashboard");
    const DarkDashboard = require("dbd-dark-dashboard");
    const GDB = require("../structures/schemas/guild.js");
    const {
      clientID,
      clientSecret,
      DBDLicense,
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
      theme: DarkDashboard({
        information: {
          createdBy: "CryoLabs",
          websiteTitle: "Aeolian",
          websiteName: "Aeolian",
          websiteUrl: "https://aeolianbot.ml/",
          dashboardUrl: "http://localhost:3000/",
          supporteMail: "hi@cryolabs.ml",
          supportServer: "https://discord.gg/HwkDSs7X82",
          imageFavicon: "https://i.imgur.com/yaAqXVz.png",
          iconURL: "https://i.imgur.com/yaAqXVz.png",
          loggedIn: "Successfully signed in.",
          mainColor: "#808080",
          subColor: "#FFFFFF",
          preloader: "Loading..",
        },

        index: {
          card: {
            category: "Aeolian | Control Center",
            title: `Welcome to Aeolian's control center, the one stop shop for customization and settings regarding our bot.`,
            image: "https://i.imgur.com/0cIP8q1.png",
          },

          information: {
            category: "Updates",
            title: "Information",
            description: `This project is a work in progress. If you have any questions, feel free to join our support server.`,
          },

          feeds: {
            category: "Updates",
            title: "Information",
            description: `This bot and panel is currently a work in progress so contact me if you find any issues on discord.`,
          },
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
      ],
    });
    Dashboard.init();
  })();
}

module.exports = { dash };
