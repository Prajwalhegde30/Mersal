const { Client } = require('pg');

async function test() {
  const url = "postgresql://neondb_owner:npg_Bsbg2cmq0XKi@ep-small-star-anm4x3ne-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
  const client = new Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected successfully!");
    await client.end();
  } catch (err) {
    console.error("Connection failed:", err.message);
    if (err.errors) {
      err.errors.forEach(e => console.error("Inner:", e.message));
    }
  }
}

test();
