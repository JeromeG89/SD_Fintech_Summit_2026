// app/api/signup/route.ts
import { NextResponse } from "next/server";
import { createSignup } from "@/services/signupService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await createSignup(body);
    return NextResponse.json({ ok: true, ...result }, { status: 201 });
  } catch (e: any) {
    if (e?.status === 409) {
      return NextResponse.json({ ok: false, message: "Email already registered." }, { status: 409 });
    }
    console.error(e);
    return NextResponse.json({ ok: false, message: "Internal Server Error" }, { status: 500 });
  }
}
