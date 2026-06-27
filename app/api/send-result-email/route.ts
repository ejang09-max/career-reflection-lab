import { NextResponse } from "next/server";
import { sendResultEmail } from "@/lib/email";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.email) {
    return NextResponse.json({ success: true, mock: true, message: "이메일을 입력하지 않아 결과 발송 기능을 사용할 수 없습니다.", missingEnv: ["recipient_email"], pdfAttached: false });
  }
  if (!body.consentEmail) {
    return NextResponse.json({ success: false, mock: true, message: "이메일 발송 동의가 필요합니다.", pdfAttached: false }, { status: 400 });
  }
  const result = await sendResultEmail({
    resultId: body.resultId,
    email: body.email,
    studentName: body.studentName,
    assessmentTitle: body.assessmentTitle ?? "진로설계 진단"
  });
  return NextResponse.json(result, { status: result.success ? 200 : 500 });
}
