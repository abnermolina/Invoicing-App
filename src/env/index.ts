import "dotenv/config";
import * as z from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "prod", "test"]).default("dev"),
  PORT: z.coerce.number().default(3000),
  SECRET_JWT: z.string(),
  SECRET_COOKIE: z.string(),
});

export const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("invalid Env Variables", _env.error.format());
  throw new Error("invalid Env Variables");
}

export const env = _env.data;
