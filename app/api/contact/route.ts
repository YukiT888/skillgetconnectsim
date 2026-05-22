import { NextResponse } from "next/server";
import type { ContactPayload } from "@/lib/contact";

function isContactPayload(value: unknown): value is ContactPayload {
  if (!value || typeof value !== "object") return false;

  const payload = value as Partial<ContactPayload>;
  return Boolean(
    payload.contact &&
      typeof payload.contact.name === "string" &&
      typeof payload.contact.email === "string" &&
      payload.simulationInput &&
      payload.estimatedStudents &&
      payload.selectedScenario,
  );
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  if (!isContactPayload(payload)) {
    return NextResponse.json({ error: "Invalid contact payload" }, { status: 400 });
  }

  const submittedAt = new Date().toISOString();

  // Replace this block with Supabase/API persistence when credentials are available.
  console.log("simulation_contact_payload", {
    submittedAt,
    ...payload,
  });

  return NextResponse.json({ ok: true, submittedAt });
}
