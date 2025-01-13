// knexfile.js
module.exports = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL || {
      // Use DATABASE_URL or individual values
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      database: process.env.PGDATABASE,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
    },
    migrations: {
      directory: "./database/migrations", // Directory where your migration files will be stored
    },
  },

  production: {
    // Important for Vercel
    client: "pg",
    connection: process.env.DATABASE_URL, // Use DATABASE_URL in production (Vercel)
    migrations: {
      directory: "./database/migrations",
    },
  },
};
