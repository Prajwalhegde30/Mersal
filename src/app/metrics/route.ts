import { NextResponse } from "next/server";
import client from "prom-client";

// Initialize default metrics
const register = new client.Registry();
client.collectDefaultMetrics({ register });

export async function GET() {
  try {
    const metrics = await register.metrics();
    return new NextResponse(metrics, {
      headers: {
        "Content-Type": register.contentType,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate metrics" }, { status: 500 });
  }
}
