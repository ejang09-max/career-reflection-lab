"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmailResultButton({
  resultId,
  email,
  studentName,
  assessmentTitle,
  consentEmail
}: {
  resultId: string;
  email: string;
  studentName: string;
  assessmentTitle: string;
  consentEmail: boolean;
}) {
  const [message, setMessage] = useState("");
  const [isMock, setIsMock] = useState(false);
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!email) {
      setIsMock(true);
      return setMessage("이메일을 입력하지 않아 결과 발송 기능을 사용할 수 없습니다.");
    }
    if (!consentEmail) return setMessage("이메일 발송 동의가 필요합니다.");
    setLoading(true);
    try {
      const response = await fetch("/api/send-result-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resultId, email, studentName, assessmentTitle, consentEmail })
      });
      const data = await response.json();
      setIsMock(Boolean(data.mock));
      if (data.mock && data.missingEnv?.length) {
        setMessage("현재는 테스트 발송 상태입니다. 실제 이메일은 발송되지 않습니다. 결과는 PDF로 다운로드해주세요.");
      } else if (!data.success) {
        setMessage("이메일 발송에 실패했습니다. Resend 설정과 Vercel 환경변수를 확인해주세요.");
      } else {
        setMessage(data.message ?? "요청이 처리되었습니다.");
      }
    } catch {
      setIsMock(false);
      setMessage("이메일 발송 중 문제가 발생했습니다. 환경변수, Resend API Key, 발신 이메일 인증 상태를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button className="h-10 border-slate-200 bg-white text-slate-600 hover:bg-slate-50" variant="outline" onClick={send} disabled={loading}>
        <Mail size={18} /> 이메일로 보내기(테스트)
      </Button>
      {message && <p className={`text-sm font-medium ${isMock ? "text-amber-700" : "text-slate-600"}`}>{message}</p>}
    </div>
  );
}
