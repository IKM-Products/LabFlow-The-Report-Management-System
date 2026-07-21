// app/api/signup/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Omit frontend-only fields (terms) before sending to backend
    const { terms, ...backendPayload } = body;

    const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.1.109:8082/api").replace(/\/$/, "");
    const targetUrl = `${baseUrl}/special/user/create`;

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(backendPayload),
    });

    const rawText = await response.text();
    let data: any = {};
    try {
      data = JSON.parse(rawText);
    } catch {
      data = { raw: rawText };
    }

    // 2. Handle backend errors or DB constraint failures
    if (!response.ok || data.success === false) {
      let rawError =
        (Array.isArray(data.messages) && data.messages.length > 0 ? data.messages[0] : null) ||
        data.message ||
        data.error ||
        data.detail ||
        data.msg ||
        (Array.isArray(data.errors) ? data.errors[0] : null) ||
        "Failed to create account on backend.";

      if (typeof rawError === "string" && rawError.includes("users_email_key")) {
        rawError = "An account with this email address already exists.";
      }

      return NextResponse.json(
        { 
          success: false, 
          message: rawError 
        },
        { status: response.ok ? 400 : response.status }
      );
    }

    // 3. Return successful response
    return NextResponse.json(data, { status: response.status || 201 });
  } catch (error: any) {
    console.error("Error in /api/signup route handler:", error);
    return NextResponse.json(
      { success: false, message: "Unable to connect to the backend server." },
      { status: 500 }
    );
  }
}