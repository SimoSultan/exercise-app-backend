const { Pool } = require("pg");

const db = new Pool({
  connectionString:
    process.env.USE_LOCAL_DB === "true"
      ? process.env.DATABASE_URL_LOCAL
      : process.env.DATABASE_URL,
  ssl:
    process.env.USE_LOCAL_DB === "true"
      ? false
      : {
          rejectUnauthorized: Boolean(process.env.NODE_ENV === "production"),
        },
});

try {
  db.connect();
  console.log(
    `${
      process.env.USE_LOCAL_DB === "true" ? "Local" : "Neon"
    } database connection successful!`
  );
} catch {
  console.error("Error during database connection startup:", error);
  process.exit(1); // Important: Exit the process on error
}

module.exports = db;
