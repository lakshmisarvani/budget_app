const z = require("zod");
const dotenv = require("dotenv");
dotenv.config();

const envSchema = z.object({
  PORT: z.string().optional(),
  MONGO_URI: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  EMAIL_USER: z.string().min(1),
  EMAIL_PASS: z.string().min(1),
  CLIENT_URL: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
});

export const env = envSchema.parse(process.env);
