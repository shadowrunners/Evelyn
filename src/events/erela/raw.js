const client = require("../../structures/index.js");

client.on("raw", (d) => client.manager.updateVoiceState(d));