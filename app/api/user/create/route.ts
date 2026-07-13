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
        timeout: 6000,
      }
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("❌ --- START BACKEND SERVER ERROR LOG --- ❌");
    if (error.response) {
      console.error(`Status Code: ${error.response.status}`);
      console.error("Payload Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("No Response Received. Error Message:", error.message);
    }
    console.error("❌ --- END BACKEND SERVER ERROR LOG --- ❌");

    let clientErrorMessage = "Internal backend server configuration mismatch.";
    let status = error.response?.status || 500;

    if (error.response?.data) {
      const data = error.response.data;
      let rawMessage = "";

      if (typeof data === "object") {
        rawMessage = data.message || data.error || (data.messages && data.messages[0]) || JSON.stringify(data);
      } else if (typeof data === "string") {
        rawMessage = data;
      }

      // Intercept the backend's raw SQL error and rewrite it for the user
      if (rawMessage.includes("23505") || rawMessage.includes("users_email_key")) {
        clientErrorMessage = "This email address is already registered. Please use another one or log in.";
        status = 409; // Override 500 to 409 Conflict status code
      } else if (rawMessage.includes("<!DOCTYPE html>") || rawMessage.includes("<html>")) {
        clientErrorMessage = `Backend service crashed with a Status ${status}. Please check server infrastructure.`;
      } else {
        clientErrorMessage = rawMessage;
      }
    } else if (error.code === "ECONNREFUSED") {
      clientErrorMessage = "Connection refused! Is your Spring Boot app running on port 8080?";
    } else if (error.message) {
      clientErrorMessage = error.message;
    }

    return NextResponse.json(
      { message: clientErrorMessage },
      { status: status }
    );
  }
}