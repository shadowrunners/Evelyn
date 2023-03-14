import { Evelyn } from "./structures/Evelyn"
import { token } from "./structures/config.json";

const client = new Evelyn();
client.login(token);