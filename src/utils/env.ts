import { config as dotenvConfig } from "dotenv";
import { resolve as resolvePath } from "path";

// Determine the environment file based on NODE_ENV
const environmentFileSuffix =
  process.env.NODE_ENV === "development" ? ".development.env" : ".env";

const environmentFilePath = resolvePath(process.cwd(), environmentFileSuffix);

dotenvConfig({ path: environmentFilePath });

export function getEnv(name: string, fb?: string): string {
  const value = process.env[name] ?? fb;

  if (value === undefined) {
    throw new Error(`Environment variable ${name} has not been set.`);
  }

  return value;
}
