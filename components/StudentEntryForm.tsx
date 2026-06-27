"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, LogOut, Mail, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CORE_DESCRIPTION } from "@/lib/constants";
import { clearCurrentStudent, saveCurrentStudent } from "@/lib/clientStorage";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { getCurrentUser, getMyProfile } from "@/lib/supabaseResults";

export function StudentEntryForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consentEmail, setConsentEmail] = useState(false);
  const [error, setError] = useState("");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    async function loadAuth() {
      const user = await getCurrentUser();
      if (!user) {
        setAuthLoading(false);
        return;
      }
      const profile = await getMyProfile();
      const displayName = profile?.name || (user.user_metadata?.name as string | undefined) || user.email?.split("@")[0] || "학생";
      setAuthName(displayName);
      setAuthEmail(user.email ?? "");
      saveCurrentStudent({ name: displayName, email: user.email ?? "", consentEmail: true, mode: "auth" });
      setAuthLoading(false);
    }
    loadAuth();
  }, []);

  function submit() {
    if (!name.trim()) return setError("이름을 입력해주세요.");
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("올바른 이메일 주소를 입력해주세요.");
    try {
      saveCurrentStudent({ name: name.trim(), email: email.trim(), consentEmail: Boolean(email.trim()) && consentEmail, mode: "guest" });
    } catch {
      // 브라우저 저장소가 막혀도 체험 진단 시작 자체는 이어지게 합니다.
    }
    router.push("/select");
    window.setTimeout(() => {
      if (window.location.pathname !== "/select") window.location.assign("/select");
    }, 150);
  }

  async function logout() {
    const supabase = getSupabaseBrowserClient();
    await supabase?.auth.signOut();
    clearCurrentStudent();
    setAuthName("");
    setAuthEmail("");
  }

  if (authLoading) {
    return (
      <Card className="soft-panel mx-auto w-full max-w-xl border-white/80">
        <CardContent className="p-8 text-center text-sm text-slate-600">사용자 정보를 확인하는 중입니다.</CardContent>
      </Card>
    );
  }

  if (authName) {
    return (
      <Card className="soft-panel mx-auto w-full max-w-xl border-white/80">
        <CardHeader className="p-6 text-center sm:p-8">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-sky-500 text-white">
            <CheckCircle2 size={24} />
          </div>
          <p className="text-sm font-semibold text-sky-600">Career Reflection Lab</p>
          <CardTitle className="mt-2 text-3xl leading-tight sm:text-4xl">진로설계 가이드</CardTitle>
          <p className="mt-4 text-xl font-bold text-slate-950">{authName}님, 다시 오신 것을 환영합니다.</p>
          <p className="mt-2 text-sm text-slate-500">{authEmail}</p>
        </CardHeader>
        <CardContent className="space-y-3 p-6 pt-0 sm:p-8 sm:pt-0">
          <Link className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-sky-500 text-base font-semibold text-white hover:bg-sky-600" href="/select">진단 선택하기</Link>
          <Link className="inline-flex h-12 w-full items-center justify-center rounded-lg border bg-white text-base font-semibold text-slate-700 hover:bg-slate-50" href="/mypage">내 결과 보기</Link>
          <Button className="h-11 w-full" variant="outline" onClick={logout}>
            <LogOut size={18} /> 로그아웃
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="soft-panel mx-auto w-full max-w-xl border-white/80">
      <CardHeader className="p-6 text-center sm:p-8">
        <p className="text-sm font-semibold text-sky-600">Career Reflection Lab</p>
        <CardTitle className="mt-2 text-3xl leading-tight sm:text-4xl">진로설계 가이드</CardTitle>
        <p className="mt-3 text-base leading-7 text-slate-600">
          흥미, 가치, 역량, 준비도를 차분히 살펴보며 나의 진로 방향을 정리해보는 교육용 진단 도구입니다.
        </p>
      </CardHeader>
      <CardContent className="space-y-5 p-6 pt-0 sm:p-8 sm:pt-0">
        <div className="grid gap-3 sm:grid-cols-2">
          <Link className="inline-flex h-11 items-center justify-center rounded-lg bg-sky-500 text-sm font-semibold text-white hover:bg-sky-600" href="/auth/login">로그인하고 시작하기</Link>
          <Link className="inline-flex h-11 items-center justify-center rounded-lg border bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50" href="/auth/signup">회원가입</Link>
        </div>
        <div className="rounded-lg border border-sky-100 bg-sky-50/70 p-4 text-sm leading-6 text-sky-950">
          <p className="font-bold">체험모드로 시작하기</p>
          <p className="mt-1">체험 모드에서는 결과가 현재 브라우저에만 저장됩니다. 다른 기기에서 다시 확인하려면 회원가입 후 이용해주세요.</p>
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold">이름 <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs text-sky-700">필수</span></label>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input className="pl-10" value={name} onChange={(event) => setName(event.target.value)} placeholder="예: 김하늘" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold">이메일 <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">선택</span></label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input className="pl-10" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="결과를 이메일로 받고 싶다면 입력해주세요." type="email" />
          </div>
          <p className="text-xs leading-5 text-slate-500">이메일을 입력하면 결과 페이지에서 리포트 발송을 선택할 수 있습니다.</p>
        </div>
        <p className="rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-500">입력하신 이름과 이메일은 본 진단 결과 확인 및 리포트 발송 목적에만 사용됩니다. 본인의 동의 없이 외부로 제공되거나 공개되지 않습니다.</p>
        <label className="flex items-start gap-3 rounded-lg border bg-white/90 p-4 text-sm leading-6 text-slate-700 transition hover:border-indigo-200 hover:bg-white">
          <input className="mt-1 h-4 w-4 accent-indigo-600" checked={consentEmail} onChange={(event) => setConsentEmail(event.target.checked)} type="checkbox" />
          <span>진단 결과를 이메일로 받을 수 있도록 이메일 발송 안내에 동의합니다.</span>
        </label>
        <div className="rounded-lg border border-indigo-100 bg-white/80 p-4 text-sm leading-6 text-slate-700">
          <p className="font-semibold">{CORE_DESCRIPTION}</p>
        </div>
        {error && <p className="rounded-md bg-rose-50 p-3 text-sm font-medium text-rose-700">{error}</p>}
        <Button className="h-12 w-full text-base" type="button" onClick={submit}>
          나의 진로 탐색 시작하기 <ArrowRight size={18} />
        </Button>
      </CardContent>
    </Card>
  );
}
