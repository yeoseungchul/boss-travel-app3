import { NextResponse } from "next/server";

const NOT_IMPLEMENTED = {
  ok: false,
  code: "not_implemented",
  message: "Payment API is a stub. Wire your PG here with server-only credentials.",
} as const;

/**
 * Reserved for future PG (deposit / partial pay). No secrets on the client.
 * Implement POST with server-side key + idempotency when integrating.
 */
export function GET() {
  return NextResponse.json(NOT_IMPLEMENTED, { status: 501 });
}

export function POST() {
  return NextResponse.json(NOT_IMPLEMENTED, { status: 501 });
}
