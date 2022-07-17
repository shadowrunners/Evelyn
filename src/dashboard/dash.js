function dash(client) {
    (async () => {
        const DBD = require('discord-dashboard');
        const DarkDashboard = require("dbd-dark-dashboard");
        const GDB = require("../structures/schemas/guildDB.js");
        const AMDB = require("../structures/schemas/automodDB.js");
        const { clientID, clientSecret, DBDLicense, redirectUri, domain } = require("../structures/config.json");

        await DBD.useLicense(DBDLicense);
        DBD.Dashboard = DBD.UpdatedClass();

        const Dashboard = new DBD.Dashboard({
            port: 80,
            client: {
                id: clientID,
                secret: clientSecret
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
                    preloader: "Loading.."
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
                        list: [{
                            commandName: 'bug',
                            commandUsage: `;bug <bug>`,
                            commandDescription: `test`,
                            commandAlias: 'No aliases'
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
                    categoryId: 'logs',
                    categoryName: "Logging",
                    categoryDescription: "Empower your server with our powerful logging solution.",
                    categoryOptionsList: [
                        {
                            optionId: 'logswitch',
                            optionName: "Enable/Disable Logging",
                            optionDescription: "Enable or disable logging.",
                            optionType: DBD.formTypes.switch(false),
                            getActualSet: async ({ guild }) => {
                                const data = await GDB.findOne({ id: guild.id });
                                const savedData = data.logs.enabled;
                                const defaultState = false;
                                return (savedData == null || savedData == undefined) ? defaultState : savedData; 
                            },
                            setNew: async ({ guild, newData }) => {
                                const data = await GDB.findOne({ id: guild.id });
                                data.logs.enabled = newData;
                                data.save();
                                return;
                            }
                        },
                        {
                            optionId: 'logchannel',
                            optionName: "Log Channel",
                            optionDescription: "Set the logs channel.",
                            optionType: DBD.formTypes.channelsSelect(false, ['GUILD_TEXT']),
                            getActualSet: async ({ guild }) => {
                                const data = await GDB.findOne({ id: guild.id });
                                const savedData = data.logs.channel || null;
                                const defaultState = false;
                                return (savedData == null || savedData == undefined) ? defaultState : savedData; 
                            },
                            setNew: async ({ guild, newData }) => {
                                const data = await GDB.findOne({ id: guild.id });
                                data.logs.channel = newData;
                                data.save();
                                return;
                            }
                        }
                    ]
                },
                {
                    categoryId: 'wl_gbye',
                    categoryName: "Welcome / Goodbye",
                    categoryDescription: "A fully fledged welcoming system.",
                    categoryOptionsList: [
                        {
                            optionType: 'spacer',
                            title: 'Welcome Embed Configuration',
                            description: 'This section contains the configuration for the welcome embed. Scroll down for the goodbye embed configuration.',
                        },
                        {
                            optionId: 'wlswitch',
                            optionName: "Enable/Disable welcoming",
                            optionDescription: "Enable or disable the welcome message.",
                            optionType: DBD.formTypes.switch(false),
                            getActualSet: async ({ guild }) => {
                                const data = await GDB.findOne({ id: guild.id });
                                const savedData = data.welcome.enabled;
                                const defaultState = false;
                                return (savedData == null || savedData == undefined) ? defaultState : savedData;
                            },
                            setNew: async ({ guild, newData }) => {
                                const data = await GDB.findOne({ id: guild.id });
                                data.welcome.enabled = newData;
                                data.save();
                                return;
                            }
                        },
                        {
                            optionId: 'wl_channel',
                            optionName: "Welcome Channel",
                            optionDescription: "Set the channel where the welcome message will be sent in.",
                            optionType: DBD.formTypes.channelsSelect(false, ['GUILD_TEXT']),
                            getActualSet: async ({ guild }) => {
                                const data = await GDB.findOne({ id: guild.id });
                                const savedData = data.welcome.channel || null;
                                const defaultState = false;
                                return (savedData == null || savedData == undefined) ? defaultState : savedData;
                            },
                            setNew: async ({ guild, newData }) => {
                                const data = await GDB.findOne({ id: guild.id });
                                data.welcome.channel = newData;
                                data.save();
                                return;
                            }
                        },
                        {
                            optionId: 'welcomeemb',
                            optionName: "Welcome Embed",
                            optionDescription: "Configure the embed that will be sent once someone joins.",
                            optionType: DBD.formTypes.embedBuilder({
                                username: client.user.username,
                                avatarURL: client.user.avatarURL({ dynamic: true }),
                                defaultJson: {
                                    embed: {
                                        description: `Welcome, {user.username}!\n\nPlease read the rules and have fun!`,
                                        footer: {
                                            text: "This is a sample message. Change it to your liking."
                                        },
                                    },
                                }
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
                            }
                        },
                        {
                            optionType: 'spacer',
                            title: 'Goodbye Embed Configuration',
                            description: 'This section contains the configuration for the goodbye embed.',
                        },
                        {
                            optionId: 'gbswitch',
                            optionName: "Enable/Disable the goodbye message.",
                            optionDescription: "Enable or disable the goodbye message.",
                            optionType: DBD.formTypes.switch(false),
                            getActualSet: async ({ guild }) => {
                                const data = await GDB.findOne({ id: guild.id });
                                const savedData = data.goodbye.enabled;
                                const defaultState = false;
                                return (savedData == null || savedData == undefined) ? defaultState : savedData;
                            },
                            setNew: async ({ guild, newData }) => {
                                const data = await GDB.findOne({ id: guild.id });
                                data.goodbye.enabled = newData;
                                data.save();
                                return;
                            }
                        },
                        {
                            optionId: 'gb_channel',
                            optionName: "Goodbye Channel",
                            optionDescription: "Set the channel where the goodbye message will be sent in.",
                            optionType: DBD.formTypes.channelsSelect(false, ['GUILD_TEXT']),
                            getActualSet: async ({ guild }) => {
                                const data = await GDB.findOne({ id: guild.id });
                                const savedData = data.goodbye.channel || null;
                                const defaultState = false;
                                return (savedData == null || savedData == undefined) ? defaultState : savedData;
                            },
                            setNew: async ({ guild, newData }) => {
                                const data = await GDB.findOne({ id: guild.id });
                                data.goodbye.channel = newData;
                                data.save();
                                return;
                            }
                        },
                        {
                            optionId: 'goodbyeemb',
                            optionName: "Goodbye Embed",
                            optionDescription: "Configure the embed that will be sent once someone leaves.",
                            optionType: DBD.formTypes.embedBuilder({
                                username: client.user.username,
                                avatarURL: client.user.avatarURL({ dynamic: true }),
                                defaultJson: {
                                    embed: {
                                        description: `Farewell, {user.username}!\nWe welcome you back with open arms if you decide to return.`,
                                        footer: {
                                            text: "This is a sample message. Change it to your liking."
                                        },
                                    },
                                }
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
                            }
                        },
                    ]
                },
                {
                    categoryId: 'aimoderation',
                    categoryName: 'AutoMod',
                    categoryDescription: 'This section contains the configuration for the AI-powered automod system.',
                    categoryOptionsList: [
                        {
                            optionType: 'spacer',
                            title: 'AutoMod Configuration',
                            description: 'This section contains the configuration for the AI-powered automod system.',
                        },
                        {
                            optionId: 'amswitch',
                            optionName: "Enable/Disable AutoMod",
                            optionDescription: "Enable or disable the AutoMod system.",
                            optionType: DBD.formTypes.switch(false),
                            getActualSet: async ({ guild }) => {
                                const data = await GDB.findOne({ id: guild.id });
                                const savedData = data.automod.enabled;
                                const defaultState = false;
                                return (savedData == null || savedData == undefined) ? defaultState : savedData;
                            },
                            setNew: async ({ guild, newData }) => {
                                const data = await GDB.findOne({ id: guild.id });
                                data.automod.enabled = newData;
                                data.save();
                                return;
                            }
                        },
                        {
                            optionId: 'am_channels',
                            optionName: "AutoMod Channels",
                            optionDescription: "Set the channels where AutoMod will be active in.",
                            optionType: DBD.formTypes.channelsMultiSelect(false, ['GUILD_TEXT']),
                            getActualSet: async ({ guild }) => {
                                const data = await AMDB.findOne({ id: guild.id });
                                return data.ChannelIDs || [];
                            },
                            setNew: async ({ guild, newData }) => {
                                const data = await AMDB.findOne({ id: guild.id });
                                data.ChannelIDs = newData;
                                data.save();
                                return;
                            }
                        },
                        {
                            optionId: 'am_bypass',
                            optionName: "AutoMod Bypass",
                            optionDescription: "Set the roles that will bypass AutoMod.",
                            optionType: DBD.formTypes.rolesMultiSelect(false, true),
                            getActualSet: async ({ guild }) => {
                                const data = await AMDB.findOne({ id: guild.id });
                                return data.BypassRoles || [];
                            },
                            setNew: async ({ guild, newData }) => {
                                const data = await AMDB.findOne({ id: guild.id });
                                data.BypassRoles = newData;
                                data.save();
                                return;
                            }
                        },
                        {
                            optionId: 'am_logs',
                            optionName: "AutoMod Logs",
                            optionDescription: "Set the logs channel for AutoMod.",
                            optionType: DBD.formTypes.channelsSelect(false, ['GUILD_TEXT']),
                            getActualSet: async ({ guild }) => {
                                const data = await AMDB.findOne({ id: guild.id });
                                const savedData = data.LogChannelID || null;
                                const defaultState = false;
                                return (savedData == null || savedData == undefined) ? defaultState : savedData; 
                            },
                            setNew: async ({ guild, newData }) => {
                                const data = await AMDB.findOne({ id: guild.id });
                                data.LogChannelID = newData;
                                data.save();
                                return;
                            }
                        },
                        {
                            optionType: 'spacer',
                            title: 'Punishment Configuration',
                            description: 'This section contains the configuration for what actions will be taken when a violation has been detected.',
                        },
                        {
                            optionId: 'pnlv_1',
                            optionName: "Level 1",
                            optionDescription: "Set what action will be taken when AutoMod detects a low toxicity level.",
                            optionType: DBD.formTypes.select({ "Do Nothing": null, "Delete Message": "delete", "Kick User": "kick", "Ban User": "ban", "Timeout User": "timeout" }),
                            getActualSet: async ({ guild }) => {
                                const data = await AMDB.findOne({ id: guild.id });
                                return data.Punishments[0];
                            },
                            setNew: async ({ guild, newData }) => {
                                const data = await AMDB.findOne({ id: guild.id });
                                data.Punishments[0] = newData || null;
                                await data.save();
                                return;
                            }
                        },
                        {
                            optionId: 'pnlv_2',
                            optionName: "Level 2",
                            optionDescription: "Set what action will be taken when AutoMod detects a medium toxicity level.",
                            optionType: DBD.formTypes.select({ "Do Nothing": null, "Delete Message": "delete", "Kick User": "kick", "Ban User": "ban", "Timeout User": "timeout" }),
                            getActualSet: async ({ guild }) => {
                                const data = await AMDB.findOne({ id: guild.id });
                                return data.Punishments[1];
                            },
                            setNew: async ({ guild, newData }) => {
                                const data = await AMDB.findOne({ id: guild.id });
                                data.Punishments[1] = newData || null;
                                data.save();
                                return;
                            }
                        },
                        {
                            optionId: 'pnlv_3',
                            optionName: "Level 3",
                            optionDescription: "Set what action will be taken when AutoMod detects a high toxicity level.",
                            optionType: DBD.formTypes.select({ "Do Nothing": null, "Delete Message": "delete", "Kick User": "kick", "Ban User": "ban", "Timeout User": "timeout" }),
                            getActualSet: async ({ guild }) => {
                                const data = await AMDB.findOne({ id: guild.id });
                                return data.Punishments[2];
                            },
                            setNew: async ({ guild, newData }) => {
                                const data = await AMDB.findOne({ id: guild.id });
                                data.Punishments[2] = newData || null;
                                data.save();
                                return;
                            }
                        },
                    ]
                },
                {
                    categoryId: 'tickets',
                    categoryName: 'Tickets',
                    categoryDescription: 'This section contains the configuration for the ticket system.',
                    categoryOptionsList: [
                        {
                            optionType: 'spacer',
                            title: 'Ticket System',
                            description: 'This section contains the configuration for the ticket system.',
                        },
                        {
                            optionId: 'ticket_channel',
                            optionName: "Ticket Channel",
                            optionDescription: "Set the channel where tickets will be created.",
                            optionType: DBD.formTypes.channelsSelect(false, ['GUILD_TEXT']),
                            
                        }
                    ]
                }
            ]
        });
        Dashboard.init();
    })();
}
    
module.exports.dash = dash;