const { Client } = require("pg");

function buildDBConnectionObj() {
  // Note: `DATABASE_URL` is the var name supplied by Heroku - do not change.
  let db_url =
    process.env.NODE_ENV !== "development" ? process.env.DATABASE_URL : false;
  let ssl = false;

  if (!db_url) {
    const db_host = process.env.POSTGRES_HOST || "localhost";
    const db_port = process.env.POSTGRES_PORT || 5432;
    const db_name = process.env.POSTGRES_DB_NAME || "exercise-app";
    const db_user = process.env.POSTGRES_USER || "postgres";
    const db_pass = process.env.POSTGRES_PASSWORD || "postgres";

    db_url = `postgres://${db_user}:${db_pass}@${db_host}:${db_port}/${db_name}`;
  }

  if (
    process.env.NODE_ENV !== "development" &&
    process.env.POSTGRES_REQUIRE_SSL
  ) {
    ssl = {
      rejectUnauthorized: Boolean(process.env.POSTGRES_REJECT_UNAUTHORIZED),
    };
  }

  return {
    connectionString: db_url,
    ssl,
  };
}

const db = new Client(buildDBConnectionObj());
db.connect();

module.exports = db;
