import { NextResponse } from "next/server";
import OpenAI from "openai";
import { Client } from "pg";

export async function POST(req: Request) {
  try {
    const { messages, settings, contextSummary } = await req.json();

    if (!settings?.openRouterKey || !settings?.neonDbUrl) {
      return NextResponse.json({ error: "Missing API keys or DB configuration." }, { status: 400 });
    }

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: settings.openRouterKey,
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Mersal SQL Agent",
      }
    });

    const systemPrompt = `You are Mersal, an autonomous SQL agent. Your purpose is to help the user manage their Neon DB (PostgreSQL) instance.
You can create tables, alter schemas, and fetch data.

If the user provides context about their project structure, use it to make intelligent recommendations for their database schema.
Project Context:
${contextSummary || "None provided."}

Whenever you need to interact with the database, USE THE 'execute_sql' TOOL.
Explain what you are doing concisely. Adopt a slightly robotic, brutalist persona. Keep it bold and direct.

CRITICAL POSTGRESQL RULES:
- 'DROP TABLE IF EXISTS public.*' is INVALID SYNTAX. Never use wildcards (*) with DROP TABLE.
- To drop multiple tables, name them explicitly. If you must drop all tables, use EXACTLY this DO block:
  DO $$ DECLARE r RECORD; BEGIN FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE'; END LOOP; END $$;
- Always ensure strict adherence to PostgreSQL syntax.`;

    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...messages.filter((m: any) => m.role !== "system").map((m: any) => ({ role: m.role, content: m.content }))
    ];

    const tools = [
      {
        type: "function",
        function: {
          name: "execute_sql",
          description: "Execute a raw SQL query on the Neon DB PostgreSQL instance.",
          parameters: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "The raw SQL query to execute."
              }
            },
            required: ["query"]
          }
        }
      }
    ];

    const response = await openai.chat.completions.create({
      model: settings.modelName || "meta-llama/llama-3-8b-instruct",
      messages: apiMessages,
      tools: tools as any,
      tool_choice: "auto"
    });

    const responseMessage = response.choices[0].message;

    if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
      let finalReply = responseMessage.content || "Executing database operations...";
      const dbLogs: string[] = [];
      const dbData: any[] = [];
      
      for (const toolCall of responseMessage.tool_calls) {
        if (toolCall.function.name === "execute_sql") {
          const args = JSON.parse(toolCall.function.arguments);
          const query = args.query;
          dbLogs.push(query);

          const pgClient = new Client({ connectionString: settings.neonDbUrl });
          try {
            await pgClient.connect();
            const res: any = await pgClient.query(query);
            
            const results = Array.isArray(res) ? res : [res];
            let totalRows = 0;
            let allReturnedRows: any[] = [];
            
            for (const r of results) {
              totalRows += (r.rowCount || 0);
              if (r.rows && Array.isArray(r.rows)) {
                allReturnedRows.push(...r.rows);
              }
            }

            if (allReturnedRows.length > 0) {
               dbData.push({ query, rows: allReturnedRows.slice(0, 100), totalRows });
            } else {
               dbData.push({ query, status: `Success. ${totalRows} row(s) affected.` });
            }
          } catch (dbErr: any) {
            dbData.push({ query, error: dbErr.message });
          } finally {
            await pgClient.end();
          }
        }
      }
      
      return NextResponse.json({ reply: finalReply, dbLogs, dbData });
    }

    return NextResponse.json({ reply: responseMessage.content });

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process request." }, { status: 500 });
  }
}
