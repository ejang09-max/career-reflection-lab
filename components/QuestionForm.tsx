"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LikertScale } from "@/components/LikertScale";
import { EDUCATIONAL_NOTICE } from "@/lib/constants";
import { calculateAssessmentResult } from "@/lib/scoring";
import { getCurrentStudent, saveStoredResult } from "@/lib/clientStorage";
import { getCurrentUser, saveResultToSupabase } from "@/lib/supabaseResults";
import type { Answer, Assessment, Question, StoredStudent } from "@/lib/types";

export function QuestionForm({ assessment, questions }: { assessment: Assessment; questions: Question[] }) {
  const router = useRouter();
  const pageSize = 5;
  const [pageIndex, setPageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, 1 | 2 | 3 | 4 | 5>>({});
  const [error, setError] = useState("");
  const pageCount = Math.ceil(questions.length / pageSize);
  const start = pageIndex * pageSize;
  const currentQuestions = questions.slice(start, start + pageSize);
  const progress = Math.round((Object.keys(answers).length / questions.length) * 100);
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const unansweredOnPage = currentQuestions.filter((question) => !answers[question.id]).map((question) => question.id);

  function setScore(questionId: string, score: 1 | 2 | 3 | 4 | 5) {
    setAnswers((current) => ({ ...current, [questionId]: score }));
    setError("");
  }

  function goNext() {
    if (unansweredOnPage.length > 0) {
      setError("현재 페이지에 아직 응답하지 않은 문항이 있습니다.");
      return;
    }
    setPageIndex((value) => Math.min(value + 1, pageCount - 1));
  }

  async function submit() {
    if (unansweredOnPage.length > 0 || answeredCount < questions.length) return setError("현재 페이지에 아직 응답하지 않은 문항이 있습니다.");
    const authUser = await getCurrentUser();
    const storedStudent = getCurrentStudent();
    const student: StoredStudent = authUser
      ? {
          name: storedStudent?.name || (authUser.user_metadata?.name as string | undefined) || authUser.email?.split("@")[0] || "학생",
          email: authUser.email ?? storedStudent?.email ?? "",
          consentEmail: true,
          mode: "auth"
        }
      : storedStudent ?? { name: "학생", email: "", consentEmail: false, mode: "guest" };
    const result = calculateAssessmentResult({
      studentName: student.name,
      studentEmail: student.email,
      assessmentCode: assessment.code,
      answers: Object.entries(answers).map(([questionId, score]) => ({ questionId, score })) as Answer[]
    });
    let finalResult = result;
    if (authUser) {
      const saved = await saveResultToSupabase(result);
      if (saved.result) {
        finalResult = saved.result;
      } else {
        setError("Supabase 저장 중 문제가 발생했습니다. 브라우저 백업 결과로 먼저 표시합니다.");
      }
    }
    saveStoredResult({ ...finalResult, consentEmail: student.consentEmail });
    try {
      await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalResult)
      });
    } catch {
      // 로컬 저장 결과만으로도 화면 흐름이 이어지도록 서버 mock 저장 실패는 막지 않습니다.
    }
    router.push(`/result/${finalResult.id}`);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="glass-panel space-y-5 rounded-lg border p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">{assessment.label}</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">{assessment.title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{assessment.detailDescription ?? assessment.description}</p>
          </div>
          <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">{answeredCount} / {questions.length} 문항 완료 · {pageIndex + 1} / {pageCount} 페이지</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-sky-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="rounded-lg border border-sky-100 bg-white/90 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500 text-white"><Sparkles size={18} /></div>
            <h2 className="text-lg font-bold text-slate-950">진단 방법</h2>
          </div>
          <div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
            <p>각 문항을 읽고 현재 자신에게 가장 가깝다고 느끼는 정도를 선택해주세요. 정답은 없으며, 너무 오래 고민하기보다 현재의 나를 기준으로 응답하면 됩니다.</p>
            <div className="grid gap-2 sm:grid-cols-5">
              {["1 = 전혀 그렇지 않다", "2 = 별로 그렇지 않다", "3 = 보통이다", "4 = 대체로 그렇다", "5 = 매우 그렇다"].map((label) => (
                <span key={label} className="rounded-md bg-slate-50 px-3 py-2 text-center font-semibold text-slate-700">{label}</span>
              ))}
            </div>
            <p className="rounded-md bg-slate-50 p-3 text-xs leading-5 text-slate-500">{EDUCATIONAL_NOTICE}</p>
          </div>
        </div>
      </div>
      <Card className="soft-panel border-white/80">
        <CardHeader className="p-5 sm:p-6">
          <p className="text-sm font-semibold text-indigo-600">{pageIndex + 1} / {pageCount} 페이지</p>
          <CardTitle className="text-2xl leading-9 text-slate-950">문항에 응답해주세요</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-5 pt-0 sm:p-6 sm:pt-0">
          <div className="space-y-4">
            {currentQuestions.map((question) => {
              const isMissing = Boolean(error) && !answers[question.id];
              return (
                <div key={question.id} className={`rounded-lg border p-4 transition ${isMissing ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-white/95 hover:border-indigo-200"}`}>
                  <p className="mb-3 text-base font-semibold leading-7 text-slate-900">
                    <span className="mr-2 text-indigo-600">{question.order}</span>{question.text}
                  </p>
                  <LikertScale value={answers[question.id]} onChange={(score) => setScore(question.id, score)} />
                </div>
              );
            })}
          </div>
          {error && <p className="rounded-md bg-rose-50 p-3 text-sm font-medium text-rose-700">{error}</p>}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button variant="outline" onClick={() => setPageIndex((value) => Math.max(value - 1, 0))} disabled={pageIndex === 0}>
              <ArrowLeft size={18} /> 이전
            </Button>
            {pageIndex < pageCount - 1 ? (
              <Button onClick={goNext}>
                다음 <ArrowRight size={18} />
              </Button>
            ) : (
              <Button onClick={submit}>
                결과 보기 <Check size={18} />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
