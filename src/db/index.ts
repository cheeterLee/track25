import { neon, NeonQueryFunction, Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './schema';
import { user, session } from './schema';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';

const sql: NeonQueryFunction<boolean, boolean> = neon(
    process.env.DATABASE_URL ?? '',
);

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool, { schema });

export const adapter = new DrizzlePostgreSQLAdapter(db, session, user);
