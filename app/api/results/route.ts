import { NextResponse } from "next/server";
import { createMockResult } from "@/lib/scoring";
import { listMockResults, saveMockResult } from "@/lib/mockStore";

export async function GET() {
  return NextResponse.json({
    data: listMockResults().length ? listMockResults() : [createMockResult("riasec"), createMockResult("values"), createMockResult("career_anchors"), createMockResult("skills"), createMockResult("multiple_intelligences"), createMockResult("career_adaptability")],
    source: "mock"
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  saveMockResult(body);
  return NextResponse.json({ data: body, source: "mock", message: "MVP에서는 서버 메모리에 mock 저장했습니다." });
}
