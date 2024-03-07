import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

import type { Config } from "drizzle-kit"
export default {
	schema: "./src/db/schema.ts",
	out: "./src/db/drizzle",
	driver: "pg",
	dbCredentials: {
		connectionString: process.env.DATABASE_URL ?? '',
	},
} satisfies Config
