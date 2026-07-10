import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await axios.post(
      "http://192.168.1.90:8080/api/user/create",
      {
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        password: body.password,
        phone: body.phone,
        role_name: body.role_name,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      }
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    // This logs the exact backend failure reason to your Next.js dev terminal
    console.error("❌ BACKEND SERVER ERROR:", error.response?.data || error.message);
    
    // Safely forward the specific message back to your frontend toast component
    const backendErrorMessage = error.response?.data?.message || error.response?.data || "Internal backend server crash.";
    return NextResponse.json(
      { message: typeof backendErrorMessage === 'string' ? backendErrorMessage : JSON.stringify(backendErrorMessage) },
      { status: error.response?.status || 500 }
    );
  }
}