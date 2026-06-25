import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { ResultPdfDocument } from "@/lib/pdf";
import { createMockResult } from "@/lib/scoring";
import { getMockResult } from "@/lib/mockStore";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = getMockResult(id) ?? { ...createMockResult("values"), id };
  const buffer = await renderToBuffer(<ResultPdfDocument result={result} />);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="career-reflection-${id}.pdf"`
    }
  });
}
