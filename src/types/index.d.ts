import { Command, Subcommand, Event, Buttons, Modals } from "../interfaces/interfaces"
import { Collection } from "discord.js";
import Economy from "discord-economy-super/mongodb";

declare module discord.js {
    config: botConfig;
    commands: Collection<String, Command>;
    subCommands: Collection<String, Subcommand>;
    events: Collection<String, Event>;
    buttons: Collection<String, Buttons>;
    modals: Collection<String, Modals>;
    economy: Economy;
}