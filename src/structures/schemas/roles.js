const { model, Schema } = require("mongoose");

module.exports = model(
    "RRoles",
    new Schema({
        panelName: String,
        id: String,
        roleArray: Array,
    })
);
