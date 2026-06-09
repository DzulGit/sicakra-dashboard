import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Paksa server Next.js buat ngehapus cookie HttpOnly yang nyangkut
  response.cookies.set("sicakra_session", "", { 
    path: "/", 
    expires: new Date(0),
    httpOnly: true 
  });
  
  response.cookies.set("sicakra_role", "", { 
    path: "/", 
    expires: new Date(0) 
  });

  return response;
}