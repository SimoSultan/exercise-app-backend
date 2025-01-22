const { Client } = require("pg");

function buildDBConnectionObj() {
  let db_url = process.env.DATABASE_URL;
  let ssl = false;

  if (
    process.env.NODE_ENV === "development" &&
    process.env.USE_LOCAL_DB === "true"
  ) {
    const db_host = "localhost";
    const db_port = 5432;
    const db_name = "exercise-app";
    const db_user = "postgres";
    const db_pass = process.env.POSTGRES_PASSWORD_LOCAL_DB || "postgres";

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
