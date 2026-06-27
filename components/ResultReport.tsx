"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EDUCATIONAL_NOTICE } from "@/lib/constants";
import { getAssessment } from "@/lib/assessments";
import { getImprovementType } from "@/lib/scoring";
import { getStoredResult, saveStoredResult } from "@/lib/clientStorage";
import { getResultFromSupabase } from "@/lib/supabaseResults";
import type { AssessmentResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResultSummaryCard } from "@/components/ResultSummaryCard";
import { TypeResultCard } from "@/components/TypeResultCard";
import { TypeScoreChart } from "@/components/TypeScoreChart";
import { ReflectionQuestions } from "@/components/ReflectionQuestions";
import { PdfDownloadButton } from "@/components/PdfDownloadButton";
import { EmailResultButton } from "@/components/EmailResultButton";

type StoredResult = AssessmentResult & { consentEmail?: boolean };

const perspectives = [
  { label: "흥미", text: "끌리는 활동" },
  { label: "가치", text: "중요한 기준" },
  { label: "역량", text: "잘할 수 있는 것" },
  { label: "준비도", text: "실행하는 힘" }
];

export function ResultReport({ id }: { id: string }) {
  const [result, setResult] = useState<StoredResult | null | undefined>(undefined);

  useEffect(() => {
    async function cacheResultOnServer(resultToCache: StoredResult) {
      try {
        await fetch("/api/results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(resultToCache)
        });
      } catch {
        // 서버 mock 캐시 실패 시에도 브라우저 저장 결과 화면은 그대로 보여줍니다.
      }
    }

    async function loadResult() {
      const supabaseResult = await getResultFromSupabase(id);
      if (supabaseResult.result) {
        saveStoredResult(supabaseResult.result);
        setResult({ ...supabaseResult.result, consentEmail: true });
        return;
      }
      const stored = getStoredResult(id);
      if (stored) {
        saveStoredResult(stored);
        cacheResultOnServer(stored);
        setResult(stored);
        return;
      }
      try {
        const response = await fetch("/api/results");
        const data = await response.json();
        const serverResult = (data.data as StoredResult[] | undefined)?.find((item) => item.id === id);
        if (serverResult) {
          saveStoredResult(serverResult);
          setResult(serverResult);
          return;
        }
      } catch {
        // 결과가 없는 경우 아래 안내 화면으로 이어집니다.
      }
      setResult(null);
    }
    loadResult();
  }, [id]);

  if (result === undefined) return <main className="mx-auto max-w-6xl p-6">결과를 불러오는 중입니다.</main>;

  if (result === null) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <Card>
          <CardHeader><CardTitle>결과를 찾을 수 없습니다.</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">로그인된 Supabase 결과, 브라우저 저장 결과, mock 서버 결과에서 해당 리포트를 찾지 못했습니다.</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground" href="/select">진단 선택으로 돌아가기</Link>
              <Link className="inline-flex h-11 items-center justify-center rounded-md border px-4 text-sm font-semibold text-slate-700" href="/mypage">내 결과 보기</Link>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  const topThree = [result.primaryType, ...result.secondaryTypes];
  const improvementType = getImprovementType(result);
  const assessment = getAssessment(result.assessmentCode);
  const topLabel = assessment?.topLabel ?? "상위 유형 TOP 3";
  const riasecCode = result.assessmentCode === "riasec" ? topThree.map((type) => type.typeName.split(" ")[0]).join("-") : null;
  const renderActionButtons = () => (
    <div className="flex flex-col gap-2 sm:flex-row">
      <PdfDownloadButton resultId={result.id} result={result} />
      <EmailResultButton resultId={result.id} email={result.studentEmail} studentName={result.studentName} assessmentTitle={result.assessmentTitle} consentEmail={Boolean(result.consentEmail)} />
    </div>
  );

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <ResultSummaryCard type={result.primaryType} summary={result.summary} result={result} />
      <Card className="border-sky-100">
        <CardHeader><CardTitle>대표 유형 해석</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-sky-50 p-4">
            <p className="text-sm font-semibold text-sky-700">대표 유형</p>
            <p className="mt-2 text-xl font-bold text-slate-950">{result.primaryType.typeName}</p>
          </div>
          <div className="rounded-lg bg-white p-4">
            <p className="mb-2 text-sm font-semibold text-slate-900">강점</p>
            {result.primaryType.strengths.slice(0, 3).map((item) => <p key={item} className="text-sm leading-6 text-slate-600">• {item}</p>)}
          </div>
          <div className="rounded-lg bg-amber-50 p-4">
            <p className="mb-2 text-sm font-semibold text-amber-950">주의할 점</p>
            {result.primaryType.cautions.slice(0, 2).map((item) => <p key={item} className="text-sm leading-6 text-amber-950">• {item}</p>)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>진로탐색 4가지 관점</CardTitle></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {perspectives.map((item) => {
            const active = assessment?.perspective === item.label;
            return (
              <div key={item.label} className={`rounded-md border p-4 text-sm ${active ? "border-indigo-300 bg-indigo-50 text-indigo-950" : "bg-white text-slate-600"}`}>
                <p className="font-bold">{item.label}</p>
                <p className="mt-1">{item.text}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>
      <section>
        <h2 className="mb-4 text-2xl font-bold">{topLabel}</h2>
        {riasecCode && <p className="mb-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">RIASEC 흥미코드: {riasecCode}</p>}
        <div className="grid gap-4 md:grid-cols-3">
          {topThree.map((type, index) => <TypeResultCard key={type.typeCode} type={type} rank={index + 1} />)}
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">상세 점수 및 차트</h2>
        <TypeScoreChart result={result} />
      </section>
      <Card>
        <CardHeader><CardTitle>유형별 점수표</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr><th className="p-3">유형</th><th className="p-3">원점수</th><th className="p-3">환산</th><th className="p-3">해석</th></tr>
            </thead>
            <tbody>
              {result.allTypes.map((type) => (
                <tr key={type.typeCode} className="border-t">
                  <td className="p-3 font-semibold">{type.typeName}</td>
                  <td className="p-3">{type.rawScore}/{type.maxScore}</td>
                  <td className="p-3">{type.percentage}%</td>
                  <td className="p-3 text-slate-600">{type.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      {improvementType && (
        <Card className="border-teal-100 bg-teal-50">
          <CardHeader>
            <CardTitle>{result.assessmentCode === "career_adaptability" ? "보완하면 좋은 진로적응 영역" : "보완하면 좋은 스킬"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-teal-900">{improvementType.typeName}</p>
            <p className="mt-2 text-sm leading-6 text-teal-950">
              {result.assessmentCode === "career_adaptability"
                ? "이 영역은 부족함의 표시가 아니라 앞으로 보완하면 좋은 진로적응 영역으로 볼 수 있습니다. 작은 진로 행동을 정해 실행하면서 준비도를 넓혀보세요."
                : "이 영역은 부족함의 표시가 아니라 앞으로 개발하면 좋은 영역으로 볼 수 있습니다. 작은 실천 경험을 쌓으며 스킬 프로파일을 넓혀보세요."}
            </p>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader><CardTitle>다음에 해볼 활동</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {result.primaryType.recommendedActivities.map((activity) => <p key={activity} className="rounded-lg border bg-slate-50 p-4 text-sm leading-6 text-slate-700">✓ {activity}</p>)}
        </CardContent>
      </Card>
      <ReflectionQuestions questions={result.reflectionQuestions} />
      <div className="flex flex-col gap-3 rounded-lg border bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        {renderActionButtons()}
        <Link className="inline-flex h-11 items-center justify-center rounded-md px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100" href="/select">다른 진단 선택</Link>
      </div>
      <p className="rounded-md bg-slate-100 p-4 text-sm leading-6 text-slate-600">{EDUCATIONAL_NOTICE}</p>
    </main>
  );
}
