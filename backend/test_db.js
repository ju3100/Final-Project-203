require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "vanuatu_transportbd",
  password: process.env.DB_PASSWORD || "Unvtest!@25",
  port: Number(process.env.DB_PORT || 5432)
});

pool.query("SELECT id, type, start_time, end_time, trip_time, status, pickup_location, destination_location FROM trips ORDER BY id DESC LIMIT 5", (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log(res.rows);
  }
  pool.end();
});
