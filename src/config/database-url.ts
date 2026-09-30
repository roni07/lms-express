// Shared by the app (config/env.ts) and the Prisma CLI (prisma.config.ts) so both connect the same way
export interface DatabaseConfig {
  host: string;
  port: number | string;
  user: string;
  password: string;
  name: string;
}

// Credentials are URL-encoded so passwords containing @, #, / etc. don't break the URL
export const buildDatabaseUrl = ({ host, port, user, password, name }: DatabaseConfig) =>
  `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${encodeURIComponent(name)}`;
