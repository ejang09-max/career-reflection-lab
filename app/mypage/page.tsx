"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAssessment } from "@/lib/assessments";
import { clearCurrentStudent } from "@/lib/clientStorage";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { getCurrentUser, getMyProfile, listMyResults } from "@/lib/supabaseResults";
import type { Profile, ResultListItem } from "@/lib/types";

export default function MyPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");
  const [results, setResults] = useState<ResultListItem[]>([]);
  const [message, setMessage] = useState("결과를 불러오는 중입니다.");

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      setEmail(user.email ?? "");
      const loadedProfile = await getMyProfile();
      setProfile(loadedProfile);
      const { results: loadedResults, error } = await listMyResults();
      if (error) {
        setMessage("결과를 불러오는 중 문제가 발생했습니다. Supabase 설정과 RLS 정책을 확인해주세요.");
        return;
      }
      setResults(loadedResults);
      setMessage(loadedResults.length ? "" : "아직 완료한 진단 결과가 없습니다.");
    }
    load();
  }, [router]);

  async function logout() {
    const supabase = getSupabaseBrowserClient();
    await supabase?.auth.signOut();
    clearCurrentStudent();
    router.push("/");
  }

  return (
    <main className="campus-grid min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="glass-panel rounded-lg border p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">내 결과 보관함</p>
              <h1 className="mt-3 text-3xl font-bold text-slate-950">{profile?.name ?? "학생"}님의 진단 결과</h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-600"><UserRound size={16} /> {email}</p>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut size={18} /> 로그아웃
            </Button>
          </div>
        </section>

        {message && <p className="rounded-lg border bg-white p-4 text-sm text-slate-600">{message}</p>}

        <div className="grid gap-4">
          {results.map((result) => {
            const assessment = getAssessment(result.assessment_code);
            return (
              <Card key={result.id} className="border-sky-100 bg-white/95">
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-sky-700">{assessment?.label ?? "진단"}</p>
                      <CardTitle className="text-xl">{result.assessment_title}</CardTitle>
                    </div>
                    <p className="text-sm text-slate-500">{new Date(result.created_at).toLocaleDateString("ko-KR")}</p>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-600">대표 유형: <span className="font-semibold text-slate-950">{result.primary_type ?? "결과 확인"}</span></p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Link className="inline-flex h-10 items-center justify-center rounded-lg bg-sky-500 px-4 text-sm font-semibold text-white hover:bg-sky-600" href={`/result/${result.id}`}>결과보기</Link>
                    <Link className="inline-flex h-10 items-center justify-center rounded-lg border bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50" href={`/assessment/${result.assessment_code}`}>다시 진단하기</Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Link className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white" href="/select">진단 선택으로 이동</Link>
      </div>
    </main>
  );
}
