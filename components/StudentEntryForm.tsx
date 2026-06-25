"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CORE_DESCRIPTION, EDUCATIONAL_NOTICE } from "@/lib/constants";
import { saveCurrentStudent } from "@/lib/clientStorage";

export function StudentEntryForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consentEmail, setConsentEmail] = useState(false);
  const [error, setError] = useState("");

  function submit() {
    if (!name.trim()) return setError("이름을 입력해주세요.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("올바른 이메일 주소를 입력해주세요.");
    saveCurrentStudent({ name: name.trim(), email: email.trim(), consentEmail });
    router.push("/select");
  }

  return (
    <Card className="soft-panel mx-auto w-full max-w-xl">
      <CardHeader>
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-white">
          <CheckCircle2 size={24} />
        </div>
        <CardTitle className="text-3xl">진로설계 나침반</CardTitle>
        <p className="text-slate-600">흥미, 가치, 역량, 준비도를 함께 살펴보며 나의 진로 방향을 탐색해보세요.</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold">이름</label>
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="예: 김하늘" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">이메일</label>
          <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="student@example.com" type="email" />
        </div>
        <label className="flex items-start gap-3 rounded-md border bg-white p-4 text-sm text-slate-700">
          <input className="mt-1 h-4 w-4 accent-indigo-600" checked={consentEmail} onChange={(event) => setConsentEmail(event.target.checked)} type="checkbox" />
          <span>개인정보 입력과 결과 이메일 발송 안내를 확인했습니다. 이메일 발송은 결과 화면에서 다시 선택할 수 있습니다.</span>
        </label>
        <div className="rounded-md border border-indigo-100 bg-indigo-50 p-4 text-sm leading-6 text-indigo-950">
          <p className="font-semibold">{CORE_DESCRIPTION}</p>
          <p className="mt-2 text-indigo-900">{EDUCATIONAL_NOTICE}</p>
        </div>
        {error && <p className="rounded-md bg-rose-50 p-3 text-sm font-medium text-rose-700">{error}</p>}
        <Button className="w-full" onClick={submit}>
          진단 시작하기 <ArrowRight size={18} />
        </Button>
      </CardContent>
    </Card>
  );
}
