import { getEnv } from "./utils/env";

export const Globals = {
  token: getEnv("TOKEN"),
  guild: getEnv("GUILD"),
} as const;

export default Globals;
