const Cluster = require("discord-hybrid-sharding");
const { token } = require("./structures/config.json");
const { magenta, white, green } = require("chalk");

const manager = new Cluster.Manager(`${__dirname}/structures/index.js`, {
  totalShards: "auto",
  mode: "process",
  token: token,
});

manager.on("clusterCreate", (cluster) =>
  console.log(
    magenta("Shard Manager") +
      white(" · ") +
      white("Launched cluster ") +
      green(`${cluster.id}.`)
  )
);

manager.spawn({ timeout: -1 });
