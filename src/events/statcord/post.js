const { magenta, white, red } = require("chalk");

module.exports = {
  name: "post",
  once: true,
  execute(status) {
    if (!status)
      console.log(
        `${magenta("Statcord")} ${white("·")} ${magenta("Evelyn")} ${white(
          "has successfully posted."
        )}`
      );
    else
      console.error(
        `${magenta("Statcord")} ${white("·")} ${red(
          `Evelyn has failed to post. Outputting debug info: ${status}`
        )}`
      );
  },
};
