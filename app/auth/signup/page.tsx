"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { saveCurrentStudent } from "@/lib/clientStorage";
import { upsertProfile } from "@/lib/supabaseResults";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setMessage("");
    if (!name.trim()) return setMessage("이름을 입력해주세요.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setMessage("올바른 이메일 주소를 입력해주세요.");
    if (password.length < 6) return setMessage("비밀번호는 최소 6자 이상이어야 합니다.");
    if (password !== passwordConfirm) return setMessage("비밀번호와 비밀번호 확인이 일치하지 않습니다.");

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return setMessage("Supabase 환경변수가 아직 설정되지 않았습니다. 설정 전에는 체험 모드를 이용해주세요.");

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name: name.trim() } },
    });
    setLoading(false);

    if (error) return setMessage(error.message || "회원가입 중 문제가 발생했습니다.");

    saveCurrentStudent({ name: name.trim(), email, consentEmail: true, mode: "auth" });
    if (data.session) {
      await upsertProfile(name.trim(), email);
      router.push("/select");
      return;
    }
    setMessage("회원가입이 완료되었습니다. Supabase 이메일 인증이 켜져 있다면 메일 인증 후 로그인해주세요.");
  }

  return (
    <main className="campus-grid flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="soft-panel w-full max-w-md border-white/80">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-sky-500 text-white">
            <Compass size={24} />
          </div>
          <p className="text-sm font-semibold text-sky-600">Career Reflection Lab</p>
          <CardTitle className="text-3xl">진로설계 나침반</CardTitle>
          <p className="text-sm leading-6 text-slate-600">회원가입 후 진단 결과를 안전하게 저장하고 다시 확인할 수 있습니다.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="이름" />
          <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="이메일" type="email" />
          <Input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="비밀번호 6자 이상" type="password" />
          <Input value={passwordConfirm} onChange={(event) => setPasswordConfirm(event.target.value)} placeholder="비밀번호 확인" type="password" />
          <p className="rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-500">입력하신 이름과 이메일은 본 진단 결과 확인 및 리포트 발송 목적에만 사용됩니다. 본인의 동의 없이 외부로 제공되거나 공개되지 않습니다.</p>
          {message && <p className="rounded-md bg-amber-50 p-3 text-sm font-medium text-amber-800">{message}</p>}
          <Button className="h-11 w-full bg-sky-500 hover:bg-sky-600" onClick={submit} disabled={loading}>
            회원가입
          </Button>
          <p className="text-center text-sm text-slate-600">
            이미 계정이 있나요? <Link className="font-semibold text-sky-700" href="/auth/login">로그인</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
