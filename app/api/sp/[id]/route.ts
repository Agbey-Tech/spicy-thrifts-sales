import { NextRequest, NextResponse } from "next/server";
import { SpService } from "@/services/sp.service";

const spService = new SpService();

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = await req.json();
    const { id } = await params;
    const data = await spService.updateSp(id, body);
    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await spService.deleteSp(id);
    return NextResponse.json({ success: true, data: true });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 400 },
    );
  }
}
