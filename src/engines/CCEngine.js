module.exports = {
  dash: function (client) {
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

      let data;
      let channel;
      let buttons;

      await DBD.useLicense(client.config.DBDLicense);
      DBD.Dashboard = DBD.UpdatedClass();

      const Dashboard = new DBD.Dashboard({
        port: 80,
        client: {
          id: client.config.clientID,
          secret: client.config.clientSecret,
        },
        redirectUri: client.config.redirectUri,
        domain: client.config.domain,
        ownerIDs: client.config.ownerIDs,
        bot: client,
        sessionStore: new MongoDBStore({
          uri: client.config.database,
          collection: "dashSessions",
        }),
        useTheme404: true,
        theme: SoftUI({
          customThemeOptions: {
            index: ({ req, res, config }) => {
              return {
                values: [],
                graph: {},
                cards: [],
              };
            },
          },
          websiteName: "Evelyn",
          colorScheme: "pink",
          supporteMail: "hi@edgelabs.ml",
          icons: {
            favicon: "https://i.imgur.com/0eXmmD9.png",
            noGuildIcon: "https://i.imgur.com/mtrlifm.jpg",
            sidebar: {
              darkUrl:
                "https://cdn.discordapp.com/avatars/832289090128969787/3e8394e754ee4d7f9e2d9edd43aec3f3.webp?size=2048",
              lightUrl: "",
              hideName: false,
              borderRadius: false,
              alignCenter: true,
            },
          },
          locales: {
            enUS: {
              name: "English",
              index: {
                feeds: [],
                card: {
                  category: "",
                  title: "Welcome!",
                  description:
                    "Welcome to Evelyn's Control Center, your one-stop shop for tweaks made for Evelyn.",
                },
                feedsTitle: "",
                graphTitle: "",
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
            graph: {},
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
          admin: {
            pterodactyl: {
              enabled: false,
              apiKey: "apiKey",
              panelLink: "https://panel.website.com",
              serverUUIDs: [],
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
            categoryImageURL: "https://i.imgur.com/jay42DW.png",
            categoryOptionsList: [
              {
                optionId: "logswitch",
                optionName: "Enable/Disable Logging",
                optionDescription: "Enable or disable logging.",
                optionType: DBD.formTypes.switch(false),
                getActualSet: async ({ guild }) => {
                  data = await GDB.findOne({ id: guild.id });
                  return data.logs?.enabled;
                },
                setNew: async ({ guild, newData }) => {
                  data = await GDB.findOne({ id: guild.id });
                  data.logs.enabled = newData;
                  return data.save();
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
                  data = await GDB.findOne({ id: guild.id });
                  return data.logs.channel || null;
                },
                setNew: async ({ guild, newData }) => {
                  data = await GDB.findOne({ id: guild.id });
                  data.logs.channel = newData;
                  return data.save();
                },
              },
            ],
          },
          {
            categoryId: "wl_gbye",
            categoryName: "Welcome / Goodbye",
            categoryDescription: "A fully fledged welcoming system.",
            categoryImageURL: "https://i.imgur.com/XegMzwm.png",
            categoryOptionsList: [
              {
                optionId: "wlswitch",
                optionName: "Enable/Disable welcoming",
                optionDescription: "Enable or disable the welcome message.",
                optionType: DBD.formTypes.switch(false),
                getActualSet: async ({ guild }) => {
                  data = await GDB.findOne({ id: guild.id });
                  return data.welcome?.enabled;
                },
                setNew: async ({ guild, newData }) => {
                  data = await GDB.findOne({ id: guild.id });
                  data.welcome.enabled = newData;
                  return data.save();
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
                  data = await GDB.findOne({ id: guild.id });
                  return data.welcome.channel;
                },
                setNew: async ({ guild, newData }) => {
                  data = await GDB.findOne({ id: guild.id });
                  data.welcome.channel = newData;
                  return data.save();
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
                  data = await GDB.findOne({ id: guild.id });
                  return data.welcome.message;
                },
                setNew: async ({ guild, newData }) => {
                  data = await GDB.findOne({ id: guild.id });
                  data.welcome.message = newData;
                  return data.save();
                },
              },
              {
                optionId: "gbswitch",
                optionName: "Enable/Disable the goodbye message.",
                optionDescription: "Enable or disable the goodbye message.",
                optionType: DBD.formTypes.switch(false),
                getActualSet: async ({ guild }) => {
                  data = await GDB.findOne({ id: guild.id });
                  return data.goodbye.enabled;
                },
                setNew: async ({ guild, newData }) => {
                  data = await GDB.findOne({ id: guild.id });
                  data.goodbye.enabled = newData;
                  return data.save();
                },
              },
              {
                optionId: "gb_channel",
                optionName: "Goodbye Channel",
                optionDescription:
                  "Set the channel where the goodbye message will be sent in.",
                optionType: DBD.formTypes.channelsSelect(false, [GuildText]),
                getActualSet: async ({ guild }) => {
                  data = await GDB.findOne({ id: guild.id });
                  return data.goodbye.channel;
                },
                setNew: async ({ guild, newData }) => {
                  data = await GDB.findOne({ id: guild.id });
                  data.goodbye.channel = newData;
                  return data.save();
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
                  data = await GDB.findOne({ id: guild.id });
                  return data.goodbye.message;
                },
                setNew: async ({ guild, newData }) => {
                  data = await GDB.findOne({ id: guild.id });
                  data.goodbye.message = newData;
                  return data.save();
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
                  data = await GDB.findOne({ id: guild.id });
                  return data.goodbye.json;
                },
                setNew: async ({ guild, newData }) => {
                  data = await GDB.findOne({ id: guild.id });
                  data.goodbye.json = newData;
                  return data.save();
                },
              },
            ],
          },
          {
            categoryId: "tickets",
            categoryName: "Tickets",
            categoryDescription:
              "Make assisting other users easier with our ticket support system.",
            categoryImageURL: "https://i.imgur.com/hlBewaW.png",
            categoryOptionsList: [
              {
                optionId: "ticketswitch",
                optionName: "Enable/Disable Tickets",
                optionDescription: "Enable or disable tickets.",
                optionType: DBD.formTypes.switch(false),
                getActualSet: async ({ guild }) => {
                  data = await GDB.findOne({ id: guild.id });
                  return data.tickets.enabled;
                },
                setNew: async ({ guild, newData }) => {
                  data = await GDB.findOne({ id: guild.id });
                  data.tickets.enabled = newData;
                  return data.save();
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
                  data = await GDB.findOne({ id: guild.id });
                  return data.tickets.channel;
                },
                setNew: async ({ guild, newData }) => {
                  data = await GDB.findOne({ id: guild.id });
                  data.tickets.channel = newData;
                  return data.save();
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
                  data = await GDB.findOne({ id: guild.id });
                  return data.tickets.category;
                },
                setNew: async ({ guild, newData }) => {
                  data = await GDB.findOne({ id: guild.id });
                  data.tickets.category = newData;
                  return data.save();
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
                  data = await GDB.findOne({ id: guild.id });
                  return data.tickets.transcriptChannel;
                },
                setNew: async ({ guild, newData }) => {
                  data = await GDB.findOne({ id: guild.id });
                  data.tickets.transcriptChannel = newData;
                  return data.save();
                },
              },
              {
                optionId: "tickethandlers",
                optionName: "Ticket Handlers",
                optionDescription:
                  "Select the role which will be pinged to handle tickets.",
                optionType: DBD.formTypes.rolesSelect(false),
                getActualSet: async ({ guild }) => {
                  data = await GDB.findOne({ id: guild.id });
                  return data.tickets.ticketHandlers;
                },
                setNew: async ({ guild, newData }) => {
                  data = await GDB.findOne({ id: guild.id });
                  data.tickets.ticketHandlers = newData;
                  return data.save();
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
                  data = await GDB.findOne({ id: guild.id });
                  return data.tickets.panelJSON;
                },
                setNew: async ({ guild, newData }) => {
                  data = await GDB.findOne({ id: guild.id });
                  data.tickets.panelJSON = newData;
                  await data.save();

                  channel = data.tickets?.channel;
                  if (channel) {
                    const tpChannel = client.channels.cache.get(channel);

                    buttons = new ActionRowBuilder();
                    buttons.addComponents(
                      new ButtonBuilder()
                        .setCustomId("createTicket")
                        .setLabel("Open a Ticket")
                        .setEmoji("📩")
                        .setStyle(ButtonStyle.Primary)
                    );

                    return tpChannel.send({
                      embeds: [data.tickets.panelJSON.embed],
                      components: [buttons],
                    });
                  }
                },
              },
            ],
          },
          {
            categoryId: "levels",
            categoryName: "Leveling",
            categoryDescription:
              "Make chatting more rewarding by enabling the leveling system.",
            categoryImageURL: "https://i.imgur.com/gc2Og1J.png",
            categoryOptionsList: [
              {
                optionId: "levelToggle",
                optionName: "Enable/Disable Leveling",
                optionDescription: "Enable or disable the leveling system.",
                optionType: DBD.formTypes.switch(false),
                getActualSet: async ({ guild }) => {
                  data = await GDB.findOne({ id: guild.id });
                  return data.levels.enabled;
                },
                setNew: async ({ guild, newData }) => {
                  data = await GDB.findOne({ id: guild.id });
                  data.levels.enabled = newData;
                  return data.save();
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
                  data = await GDB.findOne({ id: guild.id });
                  return data.levels.channel;
                },
                setNew: async ({ guild, newData }) => {
                  data = await GDB.findOne({ id: guild.id });
                  data.levels.channel = newData;
                  return data.save();
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
                  data = await GDB.findOne({ id: guild.id });
                  return data.levels.message;
                },
                setNew: async ({ guild, newData }) => {
                  data = await GDB.findOne({ id: guild.id });
                  data.levels.message = newData;
                  return data.save();
                },
              },
            ],
          },
          {
            categoryId: "verification",
            categoryName: "Verification",
            categoryDescription:
              "Protect your server against bots with captchas.",
            categoryImageURL: "https://i.imgur.com/hlBewaW.png",
            categoryOptionsList: [
              {
                optionId: "verifswitch",
                optionName: "Enable/Disable Verification",
                optionDescription: "Enable or disable verification.",
                optionType: DBD.formTypes.switch(false),
                getActualSet: async ({ guild }) => {
                  data = await GDB.findOne({ id: guild.id });
                  return data.verify.enabled;
                },
                setNew: async ({ guild, newData }) => {
                  data = await GDB.findOne({ id: guild.id });
                  data.verify.enabled = newData;
                  return data.save();
                },
              },
              {
                optionId: "verifiedRole",
                optionName: "Verified Role",
                optionDescription:
                  "Select the role which will be added to a user when they complete verification.",
                optionType: DBD.formTypes.rolesSelect(false),
                getActualSet: async ({ guild }) => {
                  data = await GDB.findOne({ id: guild.id });
                  return data.verify.verifiedRole;
                },
                setNew: async ({ guild, newData }) => {
                  data = await GDB.findOne({ id: guild.id });
                  data.verify.verifiedRole = newData;
                  return data.save();
                },
              },
            ],
          },
        ],
      });
      Dashboard.init();
    })();
  },
};
