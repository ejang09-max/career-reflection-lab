import { Resend } from "resend";

export type SendEmailResponse = {
  success: boolean;
  mock: boolean;
  message: string;
  error?: string;
  missingEnv?: string[];
  pdfAttached?: boolean;
};

export async function sendResultEmail({
  resultId,
  email,
  studentName,
  assessmentTitle
}: {
  resultId: string;
  email: string;
  studentName: string;
  assessmentTitle: string;
}): Promise<SendEmailResponse> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const missingEnv = [
    !process.env.RESEND_API_KEY ? "RESEND_API_KEY" : null,
    !process.env.FROM_EMAIL ? "FROM_EMAIL" : null,
    !email ? "recipient_email" : null
  ].filter(Boolean) as string[];

  if (!resultId) {
    return { success: false, mock: false, message: "이메일 발송에 실패했습니다.", error: "resultId가 없습니다.", pdfAttached: false };
  }

  const subject = `[진로설계 나침반] ${studentName}님의 진단 결과 리포트`;
  const html = `
    <p>${studentName}님, 진로설계 나침반 진단 결과 리포트가 준비되었습니다.</p>
    <p>진단명: ${assessmentTitle}</p>
    <p>아래 링크에서 결과를 확인할 수 있습니다.</p>
    <p><a href="${appUrl}/result/${resultId}">${appUrl}/result/${resultId}</a></p>
    <p>본 진단은 교육용 자기이해 도구이며, 개인의 능력이나 적성을 확정적으로 판단하지 않습니다.</p>
  `;

  if (missingEnv.length > 0) {
    return {
      success: true,
      mock: true,
      message: "현재는 테스트 발송 상태입니다. 실제 이메일은 발송되지 않습니다. 결과는 PDF로 다운로드해주세요.",
      missingEnv,
      pdfAttached: false
    };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.FROM_EMAIL as string;

  try {
    // PDF 첨부가 필요해지면 attachments 배열에 /api/pdf/[id]에서 만든 Buffer를 넣으면 됩니다.
    await resend.emails.send({ from, to: email, subject, html });
    return { success: true, mock: false, message: "입력하신 이메일로 진단 결과 리포트를 발송했습니다.", pdfAttached: false };
  } catch (error) {
    return {
      success: false,
      mock: false,
      message: "이메일 발송에 실패했습니다.",
      error: error instanceof Error ? error.message : "Unknown email error",
      pdfAttached: false
    };
  }
}
