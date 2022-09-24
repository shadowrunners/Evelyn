async function loadButtons(client) {
  const { magenta, green } = require("chalk");
  const { fileLoad } = require("../../utils/fileLoader.js");

  const files = await fileLoad("buttons");
  files.forEach((file) => {
    const button = require(file);
    if (!button.id) return;

    client.buttons.set(button.id, button);

    return console.log(
      magenta("[") +
        magenta("Buttons") +
        magenta("]") +
        " Loaded" +
        green(` ${button.id}.js`)
    );
  });
}

module.exports = { loadButtons };
