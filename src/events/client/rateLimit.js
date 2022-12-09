const { magenta, white, green } = require("chalk");

module.exports = {
  name: "rateLimit",
  execute(rateLimitData) {
    console.log(
      `${magenta("Discord API")} ${white("· Ratelimit triggered:")} ${green(
        `${rateLimitData}`
      )}`
    );
  },
};
