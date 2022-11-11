async function loadModals(client) {
  const { magenta, white, green } = require("chalk");
  const { fileLoad } = require("../../utils/fileLoader.js");

  const Files = await fileLoad("modals");

  Files.forEach((file) => {
    const modal = require(file);
    if (!modal.id) return;

    client.modals.set(modal.id, modal);

    return console.log(
      magenta("Modals") + white(" · ") + "Loaded " + green(`${modal.id}.js`)
    );
  });
}

module.exports = { loadModals };
