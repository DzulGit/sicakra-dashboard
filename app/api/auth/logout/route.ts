import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ 
    success: true, 
    message: "Sesi berhasil dihancurkan" 
  });

  // Sapu bersih seluruh cookie peninggalan login dari server
  response.cookies.set("sicakra_session", "", { expires: new Date(0), path: "/" });
  response.cookies.set("sicakra_role", "", { expires: new Date(0), path: "/" });
  response.cookies.set("sicakra_name", "", { expires: new Date(0), path: "/" });

  return response;
}