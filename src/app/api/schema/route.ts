import { NextResponse } from "next/server";
import { Client } from "pg";

export async function POST(req: Request) {
  try {
    const { settings } = await req.json();

    if (!settings?.neonDbUrl) {
      return NextResponse.json({ error: "Missing Neon DB URL in settings." }, { status: 400 });
    }

    const isNeon = settings.neonDbUrl.includes('neon.tech') || settings.neonDbUrl.includes('sslmode=require');
    
    let pgClient: Client | null = null;
    let dbConnected = false;
    let retries = 3;

    while (retries > 0 && !dbConnected) {
      pgClient = new Client({ 
        connectionString: settings.neonDbUrl,
        ...(isNeon && { ssl: { rejectUnauthorized: false } })
      });

      try {
        await pgClient.connect();
        dbConnected = true;
      } catch (err: any) {
        retries--;
        if (retries === 0) {
          let details = err.message || err.toString();
          if (err.errors && Array.isArray(err.errors)) {
            details = err.errors.map((e: any) => e.message).join(" | ");
          }
          throw new Error(`Connection failed: ${details}`);
        }
        await new Promise(res => setTimeout(res, 1500));
      }
    }

    if (!pgClient) {
      return NextResponse.json({ error: "Failed to initialize Postgres client" }, { status: 500 });
    }

    const query = `
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `;

    const res = await pgClient.query(query);
    await pgClient.end();

    const schema: Record<string, { columnName: string, dataType: string }[]> = {};

    for (const row of res.rows) {
      if (!schema[row.table_name]) {
        schema[row.table_name] = [];
      }
      schema[row.table_name].push({
        columnName: row.column_name,
        dataType: row.data_type
      });
    }

    return NextResponse.json({ schema });
  } catch (error: unknown) {
    console.error("Schema API Error:", error);
    const msg = error instanceof Error ? error.message : "Failed to fetch schema.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
