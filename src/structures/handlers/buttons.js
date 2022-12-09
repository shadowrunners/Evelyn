async function loadButtons(client) {
  const { magenta, white, green } = require("chalk");
  const { fileLoad } = require("../../functions/fileLoader.js");

  const files = await fileLoad("buttons");
  files.forEach((file) => {
    const button = require(file);
    if (!button.id) return;

    client.buttons.set(button.id, button);

    return console.log(
      `${magenta("Buttons")} ${white("· Loaded")} ${green(`${button.id}.js`)}`
    );
  });
}

module.exports = { loadButtons };
