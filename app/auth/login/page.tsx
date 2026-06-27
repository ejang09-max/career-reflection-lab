"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { saveCurrentStudent } from "@/lib/clientStorage";
import { upsertProfile } from "@/lib/supabaseResults";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setMessage("");
    if (!email.trim() || !password) return setMessage("이메일과 비밀번호를 입력해주세요.");
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return setMessage("Supabase 환경변수가 아직 설정되지 않았습니다. 설정 전에는 체험 모드를 이용해주세요.");

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error || !data.user) return setMessage("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    const name = (data.user.user_metadata?.name as string | undefined) || email.split("@")[0];
    saveCurrentStudent({ name, email: data.user.email ?? email, consentEmail: true, mode: "auth" });
    await upsertProfile(name, data.user.email ?? email);
    router.push("/select");
  }

  return (
    <main className="campus-grid flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="soft-panel w-full max-w-md border-white/80">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-sky-500 text-white">
            <LogIn size={24} />
          </div>
          <p className="text-sm font-semibold text-sky-600">Career Reflection Lab</p>
          <CardTitle className="text-3xl">로그인</CardTitle>
          <p className="text-sm leading-6 text-slate-600">저장된 진단 결과를 다시 확인하려면 로그인해주세요.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="이메일" type="email" />
          <Input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="비밀번호" type="password" />
          {message && <p className="rounded-md bg-amber-50 p-3 text-sm font-medium text-amber-800">{message}</p>}
          <Button className="h-11 w-full bg-sky-500 hover:bg-sky-600" onClick={submit} disabled={loading}>
            로그인
          </Button>
          <p className="text-center text-sm text-slate-600">
            계정이 없나요? <Link className="font-semibold text-sky-700" href="/auth/signup">회원가입</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
