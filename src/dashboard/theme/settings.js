const {
    ChannelType,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');
const GDB = require('../../structures/schemas/guild.js');
const { GuildText, GuildCategory } = ChannelType;
const channelTypes = [GuildText, GuildCategory];
const { formTypes } = require("discord-dashboard");

let data;
let channel;
let buttons;

module.exports = {
    settings: (client) => [
        {
            categoryId: 'logs',
            categoryName: 'Logging',
            categoryDescription:
                'Empower your server with our powerful logging solution.',
            categoryImageURL: 'https://i.imgur.com/jay42DW.png',
            categoryOptionsList: [
                {
                    optionId: 'logswitch',
                    optionName: 'Enable/Disable Logging',
                    optionDescription: 'Enable or disable logging.',
                    optionType: formTypes.switch(false),
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
                    optionId: 'logchannel',
                    optionName: 'Log Channel',
                    optionDescription: 'Set the logs channel.',
                    optionType: formTypes.channelsSelect(false, channelTypes),
                    getActualSet: async ({ guild }) => {
                        data = await GDB.findOne({ id: guild.id });
                        return data.logs.channel || null;
                    },
                    setNew: async ({ guild, newData }) => {
                        data = await GDB.findOne({ id: guild.id });
                        data.logs.channel = newData;
                        await data.save();

                        channel = data.logs?.channel;
                        if (channel) {
                            const logChannel = client.channels.cache.get(channel);
                            logChannel
                                .createWebhook({
                                    name: client.user.username,
                                    avatar: client.user.avatarURL(),
                                })
                                .then((webhook) => {
                                    data.logs.webhook.id = webhook.id;
                                    data.logs.webhook.token = webhook.token;
                                    return data.save();
                                });
                        }
                    },
                },
            ],
        },
        {
            categoryId: 'wl_gbye',
            categoryName: 'Welcome / Goodbye',
            categoryDescription: 'A fully fledged welcoming system.',
            categoryImageURL: 'https://i.imgur.com/XegMzwm.png',
            categoryOptionsList: [
                {
                    optionId: 'wlswitch',
                    optionName: 'Enable/Disable welcoming',
                    optionDescription: 'Enable or disable the welcome message.',
                    optionType: formTypes.switch(false),
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
                    optionId: 'wl_channel',
                    optionName: 'Welcome Channel',
                    optionDescription:
                        'Set the channel where the welcome message will be sent in.',
                    optionType: formTypes.channelsSelect(false, channelTypes),
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
                    optionId: 'welcomeemb',
                    optionName: 'Welcome Embed',
                    optionDescription:
                        'Configure the embed that will be sent once someone joins.',
                    optionType: formTypes.embedBuilder({
                        username: client.user.username,
                        avatarURL: client.user.avatarURL({ dynamic: true }),
                        defaultJson: {
                            embed: {
                                description: 'Welcome, {user.username}!\nHave fun!',
                                footer: {
                                    text: 'This is a sample message. Change it to your liking.',
                                },
                            },
                        },
                    }),
                    getActualSet: async ({ guild }) => {
                        data = await GDB.findOne({ id: guild.id });
                        return data.welcome.json;
                    },
                    setNew: async ({ guild, newData }) => {
                        data = await GDB.findOne({ id: guild.id });
                        data.welcome.json = newData;
                        return data.save();
                    },
                },
                {
                    optionId: 'gbswitch',
                    optionName: 'Enable/Disable the goodbye message.',
                    optionDescription: 'Enable or disable the goodbye message.',
                    optionType: formTypes.switch(false),
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
                    optionId: 'gb_channel',
                    optionName: 'Goodbye Channel',
                    optionDescription:
                        'Set the channel where the goodbye message will be sent in.',
                    optionType: formTypes.channelsSelect(false, channelTypes),
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
                    optionId: 'goodbyeemb',
                    optionName: 'Goodbye Embed',
                    optionDescription:
                        'Configure the embed that will be sent once someone leaves.',
                    optionType: formTypes.embedBuilder({
                        username: client.user.username,
                        avatarURL: client.user.avatarURL({ dynamic: true }),
                        defaultJson: {
                            embed: {
                                description:
                                    'Farewell, {user.username}!\nWe welcome you back with open arms if you decide to return.',
                                footer: {
                                    text: 'This is a sample message. Change it to your liking.',
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
            categoryId: 'tickets',
            categoryName: 'Tickets',
            categoryDescription:
                'Make assisting other users easier with our ticket support system.',
            categoryImageURL: 'https://i.imgur.com/hlBewaW.png',
            categoryOptionsList: [
                {
                    optionId: 'ticketswitch',
                    optionName: 'Enable/Disable Tickets',
                    optionDescription: 'Enable or disable tickets.',
                    optionType: formTypes.switch(false),
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
                    optionId: 'ticketchannel',
                    optionName: 'Ticket Channel',
                    optionDescription:
                        'Set the channel where the ticket panel embed will be sent.',
                    optionType: formTypes.channelsSelect(false, channelTypes),
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
                    optionId: 'ticketcategory',
                    optionName: 'Ticket Category',
                    optionDescription:
                        'Select the category where the ticket channels will be created.',
                    optionType: formTypes.channelsSelect(false, channelTypes),
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
                    optionId: 'tickettranscripts',
                    optionName: 'Ticket Transcripts',
                    optionDescription:
                        'Select the channel where the transcripts will be sent.',
                    optionType: formTypes.channelsSelect(false, channelTypes),
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
                    optionId: 'tickethandlers',
                    optionName: 'Ticket Handlers',
                    optionDescription:
                        'Select the role which will be pinged to handle tickets.',
                    optionType: formTypes.rolesSelect(false),
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
                    optionId: 'tpembed',
                    optionName: 'Ticket Panel Embed',
                    optionDescription:
                        'Configure the embed that will be included in the panel.',
                    optionType: formTypes.embedBuilder({
                        username: client.user.username,
                        avatarURL: client.user.avatarURL({ dynamic: true }),
                        defaultJson: {
                            embed: {
                                timestamp: new Date().toISOString(),
                                description: 'Need help? Open a ticket!',
                                author: {
                                    name: 'Evelyn | Ticketing System',
                                    url: 'https://evelynbot.ml',
                                },
                                footer: {
                                    text: 'This is a footer, change it to your liking.',
                                },
                                fields: [
                                    {
                                        name: 'Hello',
                                        value: 'This is a field.',
                                    },
                                    {
                                        name: 'Hello 2',
                                        value: 'This is a field.',
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
                                    .setCustomId('createTicket')
                                    .setLabel('Open a Ticket')
                                    .setEmoji('📩')
                                    .setStyle(ButtonStyle.Primary),
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
            categoryId: 'levels',
            categoryName: 'Leveling',
            categoryDescription:
                'Make chatting more rewarding by enabling the leveling system.',
            categoryImageURL: 'https://i.imgur.com/gc2Og1J.png',
            categoryOptionsList: [
                {
                    optionId: 'levelToggle',
                    optionName: 'Enable/Disable Leveling',
                    optionDescription: 'Enable or disable the leveling system.',
                    optionType: formTypes.switch(false),
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
                    optionId: 'levelChannel',
                    optionName: 'Level Channel',
                    optionDescription:
                        'Set the channel where level up messages will be sent.',
                    optionType: formTypes.channelsSelect(false, channelTypes),
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
                    optionId: 'xp_message',
                    optionName: 'Level Up Message',
                    optionDescription: 'Sets the Level Up message.',
                    optionType: formTypes.textarea(
                        '🎉 Congrats, {userMention}! You have levelled up to {userLevel}! 🎉',
                        null,
                        100,
                        false,
                        false,
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
            categoryId: 'qotd',
            categoryName: 'QOTD',
            categoryDescription: 'A way of automating daily questions of the day.',
            categoryImageURL: 'https://i.imgur.com/hlBewaW.png',
            categoryOptionsList: [
                {
                    optionId: 'qotdswitch',
                    optionName: 'Enable/Disable QOTD',
                    optionDescription: 'Enable or disable the QOTD module.',
                    optionType: formTypes.switch(false),
                    getActualSet: async ({ guild }) => {
                        data = await GDB.findOne({ id: guild.id });
                        return data.qotd.enabled;
                    },
                    setNew: async ({ guild, newData }) => {
                        data = await GDB.findOne({ id: guild.id });
                        data.qotd.enabled = newData;
                        return data.save();
                    },
                },
                {
                    optionId: 'qotdchannel',
                    optionName: 'QOTD Channel',
                    optionDescription:
                        'This option controls the channel in which QOTDs will be sent.',
                    optionType: formTypes.channelsSelect(false, channelTypes),
                    getActualSet: async ({ guild }) => {
                        data = await GDB.findOne({ id: guild.id });
                        return data.qotd.channel;
                    },
                    setNew: async ({ guild, newData }) => {
                        data = await GDB.findOne({ id: guild.id });
                        data.qotd.channel = newData;
                        data.qotd.serverId = guild.id;
                        return data.save();
                    },
                },
            ],
        },
    ]
}