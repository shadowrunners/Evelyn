/**
 * This is the shard spawner and Shard Manager powered by Discord Hybrid Sharding.
 */

const { ClusterManager } = require('discord-hybrid-sharding');
const { token } = require('./structures/config.json');
const { magenta, white } = require('chalk');

const manager = new ClusterManager(`${__dirname}/structures/index.js`, {
	totalShards: 'auto',
	mode: 'process',
	token: token,
});

manager.spawn({ timeout: -1 });

manager.on('clusterCreate', (cluster) =>
	console.log(
		`${magenta('Shard Manager')} ${white('·')} ${white(
			`Launched cluster ${cluster.id}.`,
		)}`,
	),
);
