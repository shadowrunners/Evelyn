const client = require("../../structures/index.js");

module.exports = {
  name: "raw",
  execute(data) {
    client.manager.updateVoiceState(data);
  },
};
