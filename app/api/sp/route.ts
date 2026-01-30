import { NextRequest, NextResponse } from "next/server";
import { SpService } from "@/services/sp.service";

const spService = new SpService();

export async function GET() {
  try {
    const data = await spService.listSps();
    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 400 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await spService.createSp(body);
    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 400 },
    );
  }
}
