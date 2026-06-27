import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { renderToBuffer } from "@react-pdf/renderer";
import { ensureKoreanFontRegistered, PDF_FONT_MISSING_MESSAGE, ResultPdfDocument } from "@/lib/pdf";
import { createMockResult } from "@/lib/scoring";
import { getMockResult } from "@/lib/mockStore";
import type { AssessmentResult } from "@/lib/types";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let result: AssessmentResult | null = null;
  const authHeader = _request.headers.get("authorization");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (authHeader && url && anonKey) {
    const supabase = createClient(url, anonKey, {
      global: { headers: { Authorization: authHeader } }
    });
    const { data } = await supabase.from("assessment_results").select("result_json").eq("id", id).maybeSingle();
    result = (data?.result_json as AssessmentResult | undefined) ?? null;
  }

  result = result ?? getMockResult(id) ?? { ...createMockResult("values"), id };
  if (!ensureKoreanFontRegistered()) {
    return NextResponse.json({ success: false, message: PDF_FONT_MISSING_MESSAGE }, { status: 500 });
  }
  const buffer = await renderToBuffer(<ResultPdfDocument result={result} />);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="career-reflection-${id}.pdf"`
    }
  });
}
