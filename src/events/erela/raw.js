const client = require("../../structures/index.js");

client.on("raw", (data) => client.manager.updateVoiceState(data));
