/**
 * This file contains the options for the graphs and cards. You can freely customize them from here.
 */
const { cpus, platform } = require('os');

function index(client, req) {
    return {
        values: [],
        graph: {},
        cards: [
            {
                title: 'Current User',
                icon: 'single-02',
                getValue: req.session?.user?.username || 'Runner',
                progressBar: {
                    enabled: false,
                    getProgress: client.guilds.cache.size,
                },
            },
            {
                title: 'CPU',
                icon: 'single-02',
                getValue: cpus()[0]
                    .model.replace('(R) Core(TM) ', ' ')
                    .replace(' CPU ', '')
                    .split('@')[0],
                progressBar: {
                    enabled: false,
                    getProgress: 50,
                },
            },
            {
                title: 'System Platform',
                icon: 'single-02',
                getValue: platform()
                    .replace('win32', 'Windows')
                    .replace('linux', 'Linux'),
                progressBar: {
                    enabled: false,
                    getProgress: 50,
                },
            },
            {
                title: 'Server count',
                icon: 'single-02',
                getValue: `${client.guilds.cache.size} out of 75`,
                progressBar: {
                    enabled: true,
                    getProgress: (client.guilds.cache.size / 75) * 100,
                },
            },
        ],
    };
};

module.exports = { index };