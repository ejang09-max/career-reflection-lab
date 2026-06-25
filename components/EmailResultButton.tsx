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
      setMessage(data.message ?? "요청이 처리되었습니다.");
    } catch {
      setIsMock(false);
      setMessage("이메일 발송 중 문제가 발생했습니다. 환경변수, Resend API Key, 발신 이메일 인증 상태를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button variant="outline" onClick={send} disabled={!consentEmail || loading}>
        <Mail size={18} /> 내 이메일로 결과 보내기
      </Button>
      {message && <p className={`text-sm font-medium ${isMock ? "text-amber-700" : "text-slate-600"}`}>{message}</p>}
    </div>
  );
}
